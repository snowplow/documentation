import json
from dbt_classes_and_funcs import *


"""
To add a new package, you need to update a few places:
In classes_and_funcs:
    - Add it to the download_docs function
    - Add it to get_source_url
In this file:
    - Add the load of the file
    - Add two calls to generate the markdown for it's macros and it's models
    - Add two calls to write the file
Create the folder structure for the package markdowns, update the index at the higher level
"""

def main():
    download_docs()

    # Load in files
    packages = ['web', 'mobile', 'media_player', 'utils', 'normalize', 'fractribution', 'ecommerce']
    package_manifests = {}
    for package in packages:
        with open(f'./manifests/{package}_manifest.json') as f:
            package_manifests[package] = json.load(f)

    # Get all models and macros for our packages
    all_macros = []
    all_models = []
    all_docs = []
    disabled_models = []
    for package_name, package in package_manifests.items():
        all_macros.append({macro_k: classFromArgs(dbt_macro, macro_v) for macro_k, macro_v in package.get('macros').items() if macro_v.get('package_name')[0:8] == 'snowplow'})
        all_docs.append({doc_k: classFromArgs(dbt_doc, doc_v) for doc_k, doc_v in package.get('docs').items() if 'dbt.__' not in doc_k})
        if package_name != 'utils':
            all_models.append({node_k: classFromArgs(dbt_model, node_v) for node_k, node_v in package.get('nodes').items() if node_v.get('resource_type') == 'model'})
            disabled_package_models = {}
            for node_k, node_v in package.get('disabled').items():
                if node_k[0:5] == 'model':
                    all_versions = [classFromArgs(dbt_model, version) for version in node_v]
                    merged_model = merge_dbt_objs('model', all_versions)
                    disabled_package_models[node_k] = merged_model
            disabled_models.append(disabled_package_models)


    # Combine them into a single dictionary for processing
    combined_macros = combine_packages('macro', all_macros)
    combined_docs = combine_packages('doc', all_docs)
    # Add the disabled models into the rest of them
    combined_models = combine_packages('model', all_models + disabled_models)

    # Combine and clean the multidb stuff for macros
    unified_macros = process_multidb_macros(combined_macros)

    # Add the referrenced by field, across all packages!
    combined_models_w_ref, combined_macros_w_ref = get_referenced_by(combined_models, unified_macros)

    # Write the files for testing purposes, comment this out later
    # with open("debug/macros.json", "w") as outfile:
    #     json.dump({k: asdict(v) for k, v in combined_macros_w_ref.items()}, outfile)

    # with open("debug/models.json", "w") as outfile:
    #     json.dump({k: asdict(v) for k, v in combined_models_w_ref.items()}, outfile)

    # Split them into packages again, add in docs for models
    # utils_models_markdown = objects_to_markdown(combined_models_w_ref, combined_docs, 'Snowplow Utils', 'snowplow_utils')
    web_models_markdown = objects_to_markdown(combined_models_w_ref, combined_docs, 'Snowplow Web', 'snowplow_web')
    mobile_models_markdown = objects_to_markdown(combined_models_w_ref, combined_docs, 'Snowplow Mobile', 'snowplow_mobile')
    media_models_markdown = objects_to_markdown(combined_models_w_ref, combined_docs,  'Snowplow Media Player', 'snowplow_media')
    normalize_models_markdown = objects_to_markdown(combined_models_w_ref, combined_docs, 'Snowplow Normalize', 'snowplow_normalize')
    fractribution_models_markdown = objects_to_markdown(combined_models_w_ref, combined_docs, 'Snowplow Fractribution', 'snowplow_fractribution')
    ecommerce_models_markdown = objects_to_markdown(combined_models_w_ref, combined_docs, 'Snowplow Ecommerce', 'snowplow_ecommerce')

    # utils_macros_markdown = objects_to_markdown(combined_macros_w_ref, combined_docs, 'Snowplow Utils', 'snowplow_utils')
    web_macros_markdown = objects_to_markdown(combined_macros_w_ref, combined_docs, 'Snowplow Web', 'snowplow_web')
    mobile_macros_markdown = objects_to_markdown(combined_macros_w_ref, combined_docs, 'Snowplow Mobile', 'snowplow_mobile')
    media_macros_markdown = objects_to_markdown(combined_macros_w_ref, combined_docs, 'Snowplow Media Player', 'snowplow_media')
    normalize_macros_markdown = objects_to_markdown(combined_macros_w_ref, combined_docs, 'Snowplow Normalize', 'snowplow_normalize')
    fractribution_macros_markdown = objects_to_markdown(combined_macros_w_ref, combined_docs, 'Snowplow Fractribution', 'snowplow_fractribution')
    ecommerce_macros_markdown = objects_to_markdown(combined_macros_w_ref, combined_docs, 'Snowplow Ecommerce', 'snowplow_ecommerce')

    # Write the files to the appropriate plcae, will not create folders for you!
    # write_docusarus_page('docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/models/index.md', 'Snowplow Utils Models', utils_models_markdown, 10, 'Reference for snowplow_utils dbt models developed by Snowplow')
    write_docusarus_page('docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md', 'Snowplow Web Models', web_models_markdown, 10, 'Reference for snowplow_web dbt models developed by Snowplow')
    write_docusarus_page('docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md', 'Snowplow Mobile Models', mobile_models_markdown, 10, 'Reference for snowplow_mobile dbt models developed by Snowplow')
    write_docusarus_page('docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md', 'Snowplow Media Player Models', media_models_markdown, 10, 'Reference for snowplow_media_player dbt models developed by Snowplow')
    write_docusarus_page('docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_normalize/models/index.md', 'Snowplow Normalize Models', normalize_models_markdown, 10, 'Reference for snowplow_normalize dbt models developed by Snowplow')
    write_docusarus_page('docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md', 'Snowplow Fractribution Models', fractribution_models_markdown, 10, 'Reference for snowplow_fractribution dbt models developed by Snowplow')
    write_docusarus_page('docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md', 'Snowplow E-Commerce Models', ecommerce_models_markdown, 10, 'Reference for snowplow_ecommerce dbt models developed by Snowplow')

    # write_docusarus_page('docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md', 'Snowplow Utils Macros', utils_macros_markdown, 20, 'Reference for snowplow_utils dbt macros developed by Snowplow')
    write_docusarus_page('docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/macros/index.md', 'Snowplow Web Macros', web_macros_markdown, 20, 'Reference for snowplow_web dbt macros developed by Snowplow')
    write_docusarus_page('docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/macros/index.md', 'Snowplow Mobile Macros', mobile_macros_markdown, 20, 'Reference for snowplow_mobile dbt macros developed by Snowplow')
    write_docusarus_page('docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md', 'Snowplow Media Player Macros', media_macros_markdown, 20, 'Reference for snowplow_media_player dbt macros developed by Snowplow')
    write_docusarus_page('docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_normalize/macros/index.md', 'Snowplow Normalize Macros', normalize_macros_markdown, 20, 'Reference fors nowplow_normalize dbt macros developed by Snowplow')
    write_docusarus_page('docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/macros/index.md', 'Snowplow Fractribution Macros', fractribution_macros_markdown, 20, 'Reference for snowplow_fractribution dbt macros developed by Snowplow')
    write_docusarus_page('docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/macros/index.md', 'Snowplow E-Commerce Macros', ecommerce_macros_markdown, 20, 'Reference for snowplow_ecommerce dbt macros developed by Snowplow')

if __name__ == '__main__':
    main()
