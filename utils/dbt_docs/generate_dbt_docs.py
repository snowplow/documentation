
from dbt_classes_and_funcs import *
import sys
from dbt_package_list import all_packages


def main():
    package_names = [x[0].split('/')[1] for x in all_packages]
    # packages = ['utils', 'web', 'mobile', 'media_player', 'normalize', 'fractribution', 'ecommerce']
    # Set your PAT key so you get the 5000 calls per hour for the github api
    # call with `token <YOUR_TOKEN> as cmd argument if using a local PAT key`
    headers = {'Authorization': f"{sys.argv[1]}"}
    download_docs(all_packages, headers)

    # Load in files
    package_manifests = {}
    package_catalogs = {}
    for package in package_names:
        with open(f'./manifests/{package}_manifest.json') as f:
            package_manifests[package] = json.load(f)
    for package in package_names:
        with open(f'./manifests/{package}_catalog.json') as f:
            package_catalogs[package] = json.load(f)

    # Get all models and macros for our packages, attempting to only get models and macros from their own package to avoid dealing with out-of-sync versions
    all_macros = []
    all_models = []
    all_docs = []
    disabled_models = []
    for package_name, package in package_manifests.items():
        all_macros.append({macro_k: classFromArgs(dbt_macro, macro_v) for macro_k, macro_v in package.get(
            'macros').items() if f'{package_name}' in macro_v.get('package_name')})
        all_docs.append({doc_k: classFromArgs(dbt_doc, doc_v) for doc_k,
                        doc_v in package.get('docs').items() if 'dbt.__' not in doc_k})
        if package_name != 'utils':
            all_models.append({node_k: classFromArgs(dbt_model, node_v) for node_k, node_v in package.get('nodes').items(
            ) if node_v.get('resource_type') == 'model' and f'{package_name}' in node_v.get('package_name')})
            disabled_package_models = {}
            for node_k, node_v in package.get('disabled').items():
                if node_k[0:5] == 'model':
                    all_versions = [classFromArgs(
                        dbt_model, version) for version in node_v]
                    merged_model = merge_dbt_objs('model', all_versions)
                    disabled_package_models[node_k] = merged_model
            disabled_models.append(disabled_package_models)

    combined_catalogs = dict()
    for package_name, package in package_catalogs.items():
        if package_name != 'utils':
            combined_catalogs |= {node_k: classFromArgs(dbt_catalog, node_v) for node_k, node_v in package.get(
                'nodes').items() if f'{package_name}' in node_k}

    # Combine them into a single dictionary for processing
    combined_macros = combine_packages('macro', all_macros)
    combined_docs = combine_packages('doc', all_docs)
    # Add the disabled models into the rest of them and add catalog columns
    merged_models = combine_packages('model', all_models + disabled_models)
    combined_models = merge_manifest_and_catalog(
        merged_models, combined_catalogs)

    # Combine and clean the multidb stuff for macros
    unified_macros = process_multidb_macros(combined_macros)

    # Add the referrenced by field, across all packages!
    combined_models_w_ref, combined_macros_w_ref = get_referenced_by(
        combined_models, unified_macros)

    # Write the files for testing purposes, comment this out later
    # with open("debug/macros.json", "w") as outfile:
    #     json.dump({k: asdict(v) for k, v in combined_macros_w_ref.items()}, outfile)

    # with open("debug/models.json", "w") as outfile:
    #     json.dump({k: asdict(v) for k, v in combined_models_w_ref.items()}, outfile)

    # Split them into packages again, add in docs for models
    for package, _ in all_packages:
        package_name = package.split('/')[1]
        model_markdown = objects_to_markdown(
            combined_models_w_ref, combined_docs, package_name.replace('_', ' ').title(), package_name)
        macro_markdown = objects_to_markdown(
            combined_macros_w_ref, combined_docs, package_name.replace('_', ' ').title(), package_name)
        write_docusarus_page(f'docs/modeling-your-data/modeling-your-data-with-dbt/reference/{package_name}/models/index.md',
                             f"{package_name.replace('_', ' ').title()} Models", model_markdown, 10, f'Reference for {package_name} dbt models developed by Snowplow')
        write_docusarus_page(f'docs/modeling-your-data/modeling-your-data-with-dbt/reference/{package_name}/macros/index.md',
                             f"{package_name.replace('_', ' ').title()} Macros", macro_markdown, 20, f'Reference for {package_name} dbt macros developed by Snowplow')


if __name__ == '__main__':
    main()
