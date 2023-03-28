This folder contains scripts used to update the reference documentation for our dbt packages automatically, and ensures the package dependencies are up-to-date for the version compatibility checker.

If you need to add a new package for each of these tools, you should follow these steps:


1. In `dbt_classes_and_funcs.py` add the package to the `download_docs` function, and to the `get_source_url` function to match the package name with the repo url.
2. If the package contains only macros, you may need to take further steps, look for where `utils` is referred to explicitly.
3. In the `docs` folder of the full repo, create the folders in `docs/modeling-your-data/modeling-your-data-with-dbt/reference` and add the index file at the package level.
4. Add the package to `dbt_package_list.py` with a tuple of the dbt package name, and the repo name within the snowplow org.

That's it, both scripts will now work with your new package, but try it locally just in case!
