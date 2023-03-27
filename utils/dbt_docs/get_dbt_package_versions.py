import requests
import base64
import re
import json
import sys
from dbt_package_list import all_packages
from dbt_classes_and_funcs import github_read_file

#Set your PAT key so you get the 5000 calls per hour for the github api
# call with `token <YOUR_TOKEN> as cmd argument if using a local PAT key`
headers = {'Authorization': f"{sys.argv[1]}"}

# Functions to decode the contents and process into the format we want
def process_package(packages):
    decoded = [x for x in packages.split('\n')[1:] if x != '']
    req_pkgs = {}
    for i in range(len(decoded)):
        if i % 2 == 0:
            pkg_name = decoded[i].split(' ')[-1]
            versions_re = re.compile('version: (.*)') # If it is hard pinned to something this will fail.
            req_versions = versions_re.findall(decoded[i+1])[0].replace('"', '').replace(',', '').replace('[', '').replace(']', '')
            req_pkgs[pkg_name] = req_versions

    return req_pkgs

def process_versions(project):
    dbt_versions_re = re.compile('require-dbt-version: (.*)')
    try:
        req_versions = dbt_versions_re.findall(project)[0].replace('"', '').replace(',', '').replace('[', '').replace(']', '')
    except IndexError:
        req_versions = '>=1.3.0 <2.0.0' # If we haven't specified, just assume it needs a new version
    return req_versions

def main():
    package_list = {}
    for our_package in all_packages:
        # get tags
        tags = requests.get(f'https://api.github.com/repos/snowplow/{our_package[1]}/git/refs/tags', headers=headers)
        package_list[our_package[0]] = {}
        for tag in tags.json():
            ref = tag['ref'].split('/')[-1]
            package_list[our_package[0]][ref] = {}
            # Get the files and process them into our dictionary
            packages = github_read_file('snowplow', our_package[1], 'packages.yml', ref, headers)
            project = github_read_file('snowplow', our_package[1], 'dbt_project.yml', ref, headers)

            package_list[our_package[0]][ref]['dbtversion'] = process_versions(project)
            package_list[our_package[0]][ref]['packages'] = process_package(packages)

    # Currently nothing is done to deal with transient dbt version dependencies, e.g. if a required package has a smaller dbt version range than the main
    # package. This should be rare for us, and the reason it can't be done is because there isn't a good semver package for python that
    # supports semver ranges as a standalone idea/class, and it would be a lot of work to implement it here for a possible edge case


    # We can however deal with inherited package dependencies, sort of. We build off the _minimum_ required package version, which is
    # not the install approach, but we can guarentee that the minimum version exists, we do not know what the max version is - to do this
    # we would have to loop and deal with semver range comparison which, as discussed above, requires a package that doesn't exist.

    for pkg, versions in package_list.items():
        for ver, ver_info in versions.items():
            # Set up one of depth/breadth first search tracker stuff
            visited_packages = set([pkg])
            unvisited_packages = list(ver_info['packages'].keys())
            unvisited_packages_versions = [re.compile('(\d*\.\d*\.\d*\S*)').findall(x)[0] for x in ver_info['packages'].values()]
            current_package = None
            current_package_version = None

            while unvisited_packages:
                # Get the next package to check children of and it's minimum required version
                current_package = unvisited_packages.pop()
                current_package_version = unvisited_packages_versions.pop()
                # Get the children packages for that package
                child_packages = package_list.get(current_package, {}).get(current_package_version, {}).get('packages', {})
                for child_pkg, child_pkg_version in child_packages.items():
                    if child_pkg not in visited_packages and child_pkg not in unvisited_packages:
                        # If that package isn't already in our list of checked or list of ones to check, add it and it's minimum version
                        unvisited_packages.append(child_pkg)
                        unvisited_packages_versions.append(re.compile('(\d*\.\d*\.\d*\S*)').findall(child_pkg_version)[0])
                # Alter the original packages list of packages to include the downstream dependecies, prefer this order as | favours rightmost value when key clash
                ver_info['packages'] = child_packages | ver_info['packages']



    # write the file out
    with open("src/dbtVersions.js", "w") as fdesc:
        fdesc.write('export const dbtVersions = ')
        json.dump(package_list, fdesc, indent = 4)
        fdesc.write('\n')


if __name__ == '__main__':
    main()
