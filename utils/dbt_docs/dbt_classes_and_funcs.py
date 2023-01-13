from dataclasses import dataclass, fields, field
from typing import Optional, Union
from copy import deepcopy
import re
import urllib.request
import os

def classFromArgs(className, argDict):
    # https://stackoverflow.com/questions/68417319/initialize-python-dataclass-from-dictionary
    fieldSet = {f.name for f in fields(className) if f.init}
    filteredArgDict = {k : v for k, v in argDict.items() if k in fieldSet}
    return className(**filteredArgDict)

@dataclass
class dbt_base:
    name: str
    description: str
    depends_on: dict[list]
    docs: dict
    original_file_path: str

    def get_lang(self):
        """Gets the language of a dbt object based on the path

        Returns:
            str: warehouse language
        """
        if 'bigquery' in self.original_file_path:
            return 'bigquery'
        elif 'snowflake' in self.original_file_path:
            return 'snowflake'
        elif 'databricks' in self.original_file_path:
            return 'databricks'
        elif 'redshift_postgres' in self.original_file_path:
            return 'redshift/postgres'
        elif 'redshift' in self.original_file_path:
            return 'redshift'
        elif 'postgres' in self.original_file_path:
            return 'postgres'
        else:
            return 'default'

@dataclass
class dbt_model(dbt_base):
    raw_code: str
    columns: dict[dict]
    paths: Optional[dict] = field(default_factory=dict)
    dispatched_sql: Optional[dict] = field(default_factory=dict)
    referenced_by: Optional[dict[list]] = field(default_factory=lambda: {'macros': [], 'nodes': []})

    def __post_init__(self):
        lang = self.get_lang()
        self.paths[lang] = self.original_file_path
        self.dispatched_sql[lang] = self.raw_code
        self.original_file_path = re.sub('bigquery|snowflake|default|redshift_postgres|redshift|postgres|databricks', '&lt;adaptor&gt;', self.original_file_path)

    def to_markdown(self, key, docs):
        """Generates the markdown for a dbt model

        Args:
            key (str): Full name of the model (key from master dict)
            docs (dict): Dictionary of docs objects for lookup

        Returns:
            str: A markdown string for the model
        """
        # Get all the information we need about the macro
        description = get_doc(self.description, docs, key) # If this was a disabled model we need to process from the actual docs
        dispatched_sql = self.dispatched_sql
        dispatched_filepath = self.paths
        columns = self.columns
        # Remove all integration test stuff from depends/refs, also de-dupe in case any made it through somehow
        depends_macros = list({x for x in self.depends_on.get('macros') if 'integration_tests' not in x})
        depends_models = list({x for x in self.depends_on.get('nodes') if 'integration_tests' not in x})
        referenced_by_macros = list({x for x in self.referenced_by.get('macros') if 'integration_tests' not in x})
        referenced_by_models = list({x for x in self.referenced_by.get('nodes') if 'integration_tests' not in x})

        # Set initial markdown, set specific header key
        markdown = [f'### {self.name.replace("_"," ").title()} {{#{key}}}',
                    '',
                    '<DbtDetails><summary>',
                    f'<code>{self.original_file_path}</code>',
                    '</summary>',
                    '',
                    '#### Description']

        # Add the description
        if description != "":
            is_documented = True
            markdown.append(description)
        else:
            is_documented = False
            markdown.append('This model does not currently have a description.')

        # Add the file paths
        if len(dispatched_filepath) > 1:
            markdown.extend(['', '#### File Paths'])
            markdown.append('<Tabs groupId="dispatched_sql">')
            for lang in sorted(dispatched_filepath):
                markdown.extend([f'<TabItem value="{lang}" label="{lang}" {"default" if lang == "default" else ""}>',
                            '',
                            f'`{dispatched_filepath[lang]}`',
                            ''
                            '</TabItem>'
                            ])
            markdown.extend(['</Tabs>', ''])

        markdown.extend(['', '#### Details'])

        # Add columns
        if columns != {}:
            markdown.extend(['<DbtDetails>', '<summary>Columns</summary>', ''])
            columns_as_table = column_dict_to_table(columns, docs, key)
            markdown.extend(columns_as_table)
            markdown.extend(['</DbtDetails>', ''])

        # Add sql
        markdown.extend(['<DbtDetails>', '<summary>Code</summary>', ''])

        markdown.append('<Tabs groupId="dispatched_sql">')
        for lang in sorted(dispatched_sql):
            source_url = get_source_url(key, dispatched_filepath[lang])
            if source_url is not None:
                link = f'<center><b><i><a href="{source_url}">Source</a></i></b></center>'
            else:
                link = ''
            markdown.extend([f'<TabItem value="{lang}" label="{lang}" {"default" if lang == "default" else ""}>',
                        '',
                        link,
                        '',
                        '```jinja2',
                        dispatched_sql[lang],
                        '```'
                        '',
                        '</TabItem>'
                        ])

        markdown.extend(['</Tabs>', ''])

        markdown.extend(['</DbtDetails>', ''])

        # Add the depends on anf references
        if depends_macros != [] or depends_models != []:
            markdown.extend(['', '#### Depends On'])

            # Generate a tab group even if there is only one of the types, just for consistency
            markdown.append('<Tabs groupId="reference">')

            if depends_models != []:
                markdown.extend(['<TabItem value="model" label="Models" default>', ''])
                for dep_model in sorted(depends_models):
                    if 'snowplow_' in dep_model:
                        package = dep_model.split('.')[1]
                        markdown.append(f'- [{dep_model}](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/{package}/models/index.md#{dep_model})')
                    else:
                        markdown.append(f'- {dep_model}')
                markdown.extend(['', '</TabItem>'])

            if depends_macros != []:
                markdown.extend(['<TabItem value="macros" label="Macros">', ''])
                for dep_macro in sorted(depends_macros):
                    if 'snowplow_' in dep_macro:
                        package = dep_macro.split('.')[1]
                        markdown.append(f'- [{dep_macro}](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/{package}/macros/index.md#{dep_macro})')
                    else:
                        markdown.append(f'- {dep_macro}')
                markdown.extend(['', '</TabItem>'])

            markdown.append('</Tabs>')


        if referenced_by_macros != [] or referenced_by_models != []:
            markdown.extend(['', '#### Referenced By'])
            # Generate a tab group even if there is only one of the types, just for consistency
            markdown.append('<Tabs groupId="reference">')

            if referenced_by_models != []:
                markdown.extend(['<TabItem value="model" label="Models" default>', ''])
                for ref_model in sorted(referenced_by_models):
                    if 'snowplow_' in ref_model:
                        package = ref_model.split('.')[1]
                        markdown.append(f'- [{ref_model}](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/{package}/models/index.md#{ref_model})')
                    else:
                        markdown.append(f'- {ref_model}')
                markdown.extend(['', '</TabItem>'])

            if referenced_by_macros != []:
                markdown.extend(['<TabItem value="macros" label="Macros">', ''])
                for ref_macro in sorted(referenced_by_macros):
                    if 'snowplow_' in ref_macro:
                        package = ref_macro.split('.')[1]
                        markdown.append(f'- [{ref_macro}](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/{package}/macros/index.md#{ref_macro})')
                    else:
                        markdown.append(f'- {ref_macro}')
                markdown.extend(['', '</TabItem>'])

            markdown.append('</Tabs>')

        markdown.extend(['</DbtDetails>', ''])
        return '\n'.join(markdown), is_documented

@dataclass
class dbt_macro(dbt_base):
    macro_sql: str
    arguments: list[dict]
    is_dispatched: Optional[bool] = False
    dispatched_sql: Optional[dict] = field(default_factory=dict)
    referenced_by: Optional[dict[list]] = field(default_factory=lambda: {'macros': [], 'nodes': []})

    def __post_init__(self):
        if 'return(adapter.dispatch' in self.macro_sql.replace(' ', ''):
            self.is_dispatched = True

    def to_markdown(self, key:str, docs = {}):
        """Generates the markdown for a dbt macro

        Args:
            key (str): Full name of the macro (key from master dict)
            docs (dict): Not used, only for consistency with dbt_model class

        Returns:
            str: A markdown string for the macro
        """

        # Get all the information we need about the macro
        description = self.description
        sql = self.macro_sql
        dispatched_sql = self.dispatched_sql
        # Remove all integration test stuff from depends/refs, also de-dupe in case any made it through somehow
        depends_macros = list({x for x in self.depends_on.get('macros') if 'integration_tests' not in x})
        referenced_by_macros = list({x for x in self.referenced_by.get('macros') if 'integration_tests' not in x})
        referenced_by_models = list({x for x in self.referenced_by.get('nodes') if 'integration_tests' not in x})

        # Set initial markdown, set specific header key
        markdown = [f'### {self.name.replace("_"," ").title()} {{#{key}}}',
                    '',
                    '<DbtDetails><summary>',
                    f'<code>{self.original_file_path}</code>',
                    '</summary>',
                    '',
                    '#### Description']

        # Add the description
        if description != "":
            is_documented = True
            description.replace('\\n', '\\n\\n')
            description_parts = description.split('####', 1) # split once on the first level 4 header - see internal style guide
            markdown.append(description_parts[0])
        else:
            is_documented = False
            description_parts = []
            markdown.append('This macro does not currently have a description.')

        # Add in argument details if there are any
        if self.arguments:
            markdown.extend(['', '#### Arguments'])
            for arg in self.arguments:
                arg_type = arg.get('type')
                arg_desc = arg.get('description')
                arg_string = f"- `{arg.get('name')}`"
                # Not all have type or description provided
                if arg_type is not None:
                    arg_string += f" *({arg_type})*"
                if arg_desc is not None:
                    arg_string += f": {arg_desc}"
                markdown.append(arg_string)

        # Add in any other headers that were included in the description
        if len(description_parts) > 1:
            markdown.extend(['', '####'+ description_parts[1], ''])

        markdown.extend(['', '#### Details'])
        # Add in the sql if there is any
        if sql != '':
            source_url = get_source_url(key, self.original_file_path)
            if source_url is not None:
                markdown.extend(['<DbtDetails>', f'<summary>Code <a href="{source_url}">(source)</a></summary>', ''])
            else:
                markdown.extend(['<DbtDetails>', f'<summary>Code</summary>', ''])
            if not dispatched_sql:
                markdown.extend(['```jinja2',
                                sql,
                                '```',
                                ''
                                ])
            # Use a tabs group for dispatced sql items
            else:
                markdown.append('<Tabs groupId="dispatched_sql">')
                markdown.extend(['<TabItem value="raw" label="Raw" default>',
                                '',
                                '```jinja2',
                                sql,
                                '```',
                                '</TabItem>'
                                ])
                for lang in sorted(dispatched_sql):
                    markdown.extend([f'<TabItem value="{lang}" label="{lang}">',
                                '',
                                '```jinja2',
                                dispatched_sql[lang],
                                '```'
                                '',
                                '</TabItem>'
                                ])

                markdown.extend(['</Tabs>', ''])

            markdown.extend(['</DbtDetails>', ''])

        # Macros can only depend on other macros
        if depends_macros:
            markdown.extend(['', '#### Depends On'])

            for dep_macro in sorted(depends_macros):
                # only add a link if we made it, so we documented it (might miss a few due to docs show false, but good enough)
                if 'snowplow_' in dep_macro:
                    package = dep_macro.split('.')[1]
                    markdown.append(f'- [{dep_macro}](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/{package}/macros/index.md#{dep_macro})')
                else:
                    markdown.append(f'- {dep_macro}')

            markdown.append('')

        if referenced_by_macros or referenced_by_models:
            markdown.extend(['', '#### Referenced By'])
            # Generate a tab group even if there is only one of the types, just for consistency
            markdown.append('<Tabs groupId="reference">')

            if referenced_by_models:
                markdown.extend(['<TabItem value="model" label="Models" default>', ''])
                for ref_model in sorted(referenced_by_models):
                    if 'snowplow_' in ref_model:
                        package = ref_model.split('.')[1]
                        markdown.append(f'- [{ref_model}](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/{package}/models/index.md#{ref_model})')
                    else:
                        markdown.append(f'- {ref_model}')
                markdown.extend(['', '</TabItem>'])

            if referenced_by_macros:
                markdown.extend(['<TabItem value="macros" label="Macros">', ''])
                for ref_macro in sorted(referenced_by_macros):
                    if 'snowplow_' in ref_macro:
                        package = ref_macro.split('.')[1]
                        markdown.append(f'- [{ref_macro}](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/{package}/macros/index.md#{ref_macro})')
                    else:
                        markdown.append(f'- {ref_macro}')
                markdown.extend(['', '</TabItem>'])

            markdown.append('</Tabs>')

        markdown.extend(['</DbtDetails>', ''])
        return '\n'.join(markdown), is_documented

@dataclass
class dbt_doc:
    block_contents: str

def merge_dbt_obj(type: str, obj1: Union[dbt_macro, dbt_model], obj2: Union[dbt_macro, dbt_model]) -> Union[dbt_macro, dbt_model]:
    """Merge 2 dbt objects into one, prioriting the first object

    Args:
        type (str): Type of the objects, macro or model
        objs (list[Union[dbt_macro, dbt_model]]): List of objects to merge

    Returns:
        Union[dbt_macro, dbt_model]: The merged object
    """
    # Default to obj1 for all flat columns
    merged_obj = deepcopy(obj1)
    for field in fields(merged_obj):
        obj1_val = getattr(merged_obj, field.name)
        # if the value is empty (string, list, dict etc.) then use the second.
        # this doesn't work for nested stuff, but deals with basic stuff at least
        if obj1_val is None or obj1_val == '' or (not obj1_val and not isinstance(obj1_val, bool)):
            setattr(merged_obj, field.name, getattr(obj2, field.name))

    if type == 'doc':
        return merge_dbt_obj

    # Combine depends on and referenced by
    merged_obj.depends_on['macros'] = list(set(obj1.depends_on['macros'] + obj2.depends_on['macros']))
    merged_obj.referenced_by['macros'] = list(set(obj1.referenced_by['macros'] + obj2.referenced_by['macros']))
    merged_obj.referenced_by['nodes'] = list(set(obj1.referenced_by['nodes'] + obj2.referenced_by['nodes']))
    # Combine dispatched sql
    for sql in obj2.dispatched_sql:
        if sql not in merged_obj.dispatched_sql:
            merged_obj.dispatched_sql[sql] = obj2.dispatched_sql[sql]
    if type == 'model':
        merged_obj.depends_on['nodes'] = list(set(obj1.depends_on['nodes'] + obj2.depends_on['nodes']))
        # Combine paths
        for path in obj2.paths:
            if path not in merged_obj.paths:
                merged_obj.paths[path] = obj2.paths[path]
        # Combine columns
        for col in obj2.columns:
            if col not in merged_obj.columns:
                merged_obj.columns[col] = obj2.columns[col]
    if type == 'macro':
        # Combine arguments
        for arg in obj2.arguments:
            if arg not in merged_obj.arguments:
                merged_obj.arguments.append(arg)

    return merged_obj

def merge_dbt_objs(type: str, objs: list[Union[dbt_macro, dbt_model]]) -> Union[dbt_macro, dbt_model]:
    """Merges multiple dbt objects into a single instance, prioritising the first object

    Args:
        type (str): Type of the objects, macro or model
        objs (list[Union[dbt_macro, dbt_model]]): List of objects to merge

    Raises:
        ValueError: When passed an empty list

    Returns:
        Union[dbt_macro, dbt_model]: The merged object
    """
    if len(objs) == 0:
        raise ValueError('No objects provided to merge')
    elif len(objs) == 1:
        return deepcopy(objs[0])
    else:
        merged = deepcopy(objs[0])
        for i in range(1, len(objs)):
            merged = merge_dbt_obj(type, merged, objs[i])
    return merged

def combine_packages(type: str, packages: list[dict[Union[dbt_macro, dbt_model]]]) -> dict[Union[dbt_macro, dbt_model]]:
    """Combines multiple packages worth of macros or models

    Args:
        type (str): Type of objects, macro or model
        packages (list[Union): List of dictionaries of dbt objects

    Returns:
        dict[Union[dbt_macro, dbt_model]]: A single dictionary with unique keys from the inputs, all values merged
    """
    all_keys = set().union(*(d.keys() for d in packages))
    combined_objects = {}
    for key in all_keys:
        matching_objs = [package.get(key) for package in packages if package.get(key) is not None]
        if matching_objs:
            combined_objects[key] = merge_dbt_objs(type, matching_objs)

    return combined_objects

def download_docs():
    # Create the manifest folder to write to
    if not (os.path.exists('./manifests')):
        os.makedirs('./manifests')

    # Get the latest manifest from each package
    urllib.request.urlretrieve("https://raw.githubusercontent.com/snowplow/dbt-snowplow-web/gh_pages/docs/manifest.json", filename="./manifests/web_manifest.json")
    urllib.request.urlretrieve("https://raw.githubusercontent.com/snowplow/dbt-snowplow-mobile/gh_pages/docs/manifest.json", filename="./manifests/mobile_manifest.json")
    urllib.request.urlretrieve("https://raw.githubusercontent.com/snowplow/dbt-snowplow-media-player/gh_pages/docs/manifest.json", filename="./manifests/media_player_manifest.json")
    urllib.request.urlretrieve("https://raw.githubusercontent.com/snowplow/dbt-snowplow-utils/gh_pages/docs/manifest.json", filename="./manifests/utils_manifest.json")
    urllib.request.urlretrieve("https://raw.githubusercontent.com/snowplow/dbt-snowplow-normalize/gh_pages/docs/manifest.json", filename="./manifests/normalize_manifest.json")
    urllib.request.urlretrieve("https://raw.githubusercontent.com/snowplow/dbt-snowplow-fractribution/gh_pages/docs/manifest.json", filename="./manifests/fractribution_manifest.json")
    urllib.request.urlretrieve("https://raw.githubusercontent.com/snowplow/dbt-snowplow-ecommerce/gh_pages/docs/manifest.json", filename="./manifests/ecommerce_manifest.json")

def get_referenced_by(imodels:dict[dbt_model], imacros: dict[dbt_macro]) -> tuple[dict[dbt_model], dict[dbt_macro]]:
    """For each model and macro passed, this creates a `reference_by` field which is used to find 1 level upstream calls for the model/macro.

    Args:
        imodels (dict): Input models
        imacros (dict): Input macros

    Returns:
        tuple[dict, dict]: Original inputs with the `referenced_by` field added.
    """
    # I don't trust pass by reference stuff and I'm too lazy to work out if we actually need this or not...
    models = deepcopy(imodels)
    macros = deepcopy(imacros)

    # Loop over models for what they reference
    for cur_model_name, cur_model in models.items():

        # Get all referenced models and macros
        references_models = cur_model.depends_on['nodes']
        references_macros = cur_model.depends_on['macros']

        # Loop over all the referenced models and add this model as a referenced by
        for referenced_model_name in references_models:
            # check we actually have this model
            if models.get(referenced_model_name) is not None:
                # add in this model
                models[referenced_model_name].referenced_by['nodes'].append(cur_model_name)

        # repeat again for macros
        for referenced_macro_name in references_macros:
            if macros.get(referenced_macro_name) is not None:
                macros[referenced_macro_name].referenced_by['nodes'].append(cur_model_name)

    # Loop over macros, same as before except they cannot depend on a model
    for cur_macro_name, cur_macro in macros.items():
        references_macros = cur_macro.depends_on['macros']
        for referenced_macro_name in references_macros:
            if macros.get(referenced_macro_name) is not None:
                macros[referenced_macro_name].referenced_by['macros'].append(cur_macro_name)

    return models, macros

def process_multidb_macros(macros: dict[dbt_macro]) -> dict[dbt_macro]:
    """Returns the input dictonary without any of the `adaptor__macro` type entries,
    adding their sql to the dispatcher macro using the `dispatched_sql` field, and adjusting the
    dependencies appropriately

    Args:
        macros (dict[dbt_macro]): A dictionary of dbt macros

    Returns:
        dict[dbt_macro]: Dictionary of dbt macros, with cross db macros unified
    """

    # Just in case
    processed_macros = deepcopy(macros)
    # List all possible adaptor prefixes
    possible_prefixes = ['default', 'snowflake', 'bigquery', 'databricks', 'spark', 'redshift', 'postgres']

    # Add the dispatched sql to the main thing
    for macro_key, macro_value in processed_macros.items():
        # Check if the sql contains a dispatcher
        if macro_value.is_dispatched:
            # chcek for each possible dispatched version
            for adaptor in possible_prefixes:
                # Get dispatched name and check if it exists
                adapted_macro_name =  macro_key.replace(macro_value.name, adaptor + '__' + macro_value.name)
                if processed_macros.get(adapted_macro_name) is None:
                    continue

                adaptor_sql = processed_macros.get(adapted_macro_name).macro_sql
                # Depends on may be different for each adapator, so we need to bring them up to the dispatcher
                adaptor_depends_on = processed_macros.get(adapted_macro_name).depends_on.get('macros')

                # Update the sql if there is any
                if adaptor_sql is not None:
                    processed_macros[macro_key].dispatched_sql[adaptor] = adaptor_sql

                # add children depends on a
                if adaptor_depends_on is not None and adaptor_depends_on != []:
                    new_depend_on_macros = list(set(processed_macros[macro_key].depends_on.get('macros') + adaptor_depends_on))
                    processed_macros[macro_key].depends_on['macros'] = new_depend_on_macros
            # remove any adaptor specific depends on
            processed_macros[macro_key].depends_on['macros'] = [x for x in processed_macros[macro_key].depends_on['macros'] if '__' not in x]

    # remove any adaptor ones from the overall list
    to_delete = []
    for macro_name in processed_macros.keys():
        if '__' in macro_name:
            to_delete.append(macro_name)
    for name in to_delete:
        del processed_macros[name]


    return processed_macros

def write_docusarus_page(filename: str, pagename: str, text: str, pagedesc: str, postition: int):
    """Write a piece of text to a docusaurs page, adding relevant mdx blocks as needed

    Args:
        filename (str): Name of the file to save it as, including relative path
        pagename (str): Title of the page
        text (str): Text in the core of the page
        pagedesc (str): Description of the page
        postition (int): Sidebar position of the page

    """
    page_header = ["---",
                f'title: "{pagename}"',
                f"description: {postition}",
                f"sidebar_position: {pagedesc}",
                "---",
                "",
                "```mdx-code-block",
                "import Tabs from '@theme/Tabs';",
                "import TabItem from '@theme/TabItem';",
                "import ThemedImage from '@theme/ThemedImage';",
                '',
                'export function DbtDetails(props) {',
                    'return <div className="dbt"><details>{props.children}</details></div>',
                '}',
                "```",
                '',
                ':::caution',
                '',
                'This page is auto-generated from our dbt packages, some information may be incomplete',
                '',
                ':::',
                '']

    with open(filename, 'w+') as outfile:
        outfile.write('\n'.join(page_header))
        outfile.write(text)

def objects_to_markdown(objects: dict[Union[dbt_macro, dbt_model]], docs: dict = {}, package: str = None, filter_key: str = None, detailed_documented: bool = False) -> str:
    """Given a list of objects, this will generate the markdown for them for docusarus snowplow

    Args:
        objects dict[Union[dbt_macro, dbt_model]]: A list of objects to document
        docs (dict, optional): A dictionary of docs objects to lookup against. Defaults to {}.
        package (str, optional): Package name to use as a level 2 hearder. Defaults to None.
        filter_key (str, optional): Value to filter for keys to include to process it. Defaults to None
        detailed_docuemnted (bool, optional): If to print detailed information about what is not documented. Defautls to False

    Returns:
        str: Markdown string for a docusaurus page
    """
    # Filter to relevant macros
    if filter_key is not None:
        cut_objects = {k:v for k,v in objects.items() if filter_key in k}
    else:
        cut_objects = {k:v for k,v in objects.items()}

    # Counters
    undocumented = []
    n_undocumented = 0
    n_total = len(cut_objects)

    if n_total == 0:
        return ''

    md = ''

    if package is not None:
        md += f'## {package}\n'

    for object in sorted(cut_objects):
        # Check for exclusions
        show_docs = cut_objects[object].docs.get('show')
        if (not show_docs) or  ('integration_tests' in object):
            continue
        # Make markdown and check if it was documented or not
        model_md, is_documented = cut_objects[object].to_markdown(object, docs)
        if not is_documented:
            undocumented.append(object)
            n_undocumented += 1
        md += model_md
        md += '\n'

    print(f'{objects[object].__class__.__name__} Documentation Coverage ({package}): {round(100*(1-n_undocumented/n_total), 1)}%')
    if detailed_documented:
        print(f'Undocumented {type(objects[object])}:')
        for model in undocumented:
            print(' - ' + model)

    return md

def get_source_url(macrokey: str, path: str) -> str:
    """Gets the package url for a macro (also works for models!) key. So far, very simple...

    Args:
        macrokey (str): a key value for the macro you want the url of
        path (str): The path of the file within the package

    Returns:
        str: Full url for the file
    """
    url = 'https://github.com/snowplow/dbt-'
    if 'snowplow_utils' in macrokey:
        url += 'snowplow-utils'
    elif 'snowplow_web' in macrokey:
        url += 'snowplow-web'
    elif 'snowplow_mobile' in macrokey:
        url += 'snowplow-mobile'
    elif 'snowplow_media_player' in macrokey:
        url += 'snowplow-media-player'
    elif 'snowplow_normalize' in macrokey:
        url += 'snowplow-normalize'
    elif 'snowplow_fractribution' in macrokey:
        url += 'snowplow-fractribution'
    elif 'snowplow_ecommerce' in macrokey:
        url += 'snowplow-ecommerce'
    else:
        return None

    url += '/blob/main/' + path

    return url

def column_dict_to_table(columns: dict, docs: dict, key: str) -> list:
    """Generates the markdown string from a dictionary of columns

    Args:
        columns (dict): Dictionary of column information
        docs (dict): Dictionary of doc objects
        key (str): The model the columns are from

    Returns:
        list: Markdown string(s) for the table of column info
    """
    table_str = ['| Column Name | Description |',
                '|--------------|-------------|']
    for col in columns.values():
        col_name = col.get('name')
        col_desc = get_doc(col.get('description'), docs, key)
        table_str.append(f'| {col_name} | {col_desc if col_desc is not None else " "} |')

    return table_str

def get_doc(text: str, docs: dict, key: str) -> str:
    """Get the true value from the docs object, if required

    Args:
        text (str): Text with the doc lookup potentially in
        docs (dict): Dictionary of docs objects
        key (str): Key of the item the text came from

    Returns:
        str: Lookuped docs, or original text if no lookup required
    """
    if '{{ doc("' in text:
        package = key.split('.')[1]
        doc_name = text.split('"')[1]
        doc_key = package + '.' + doc_name
        # Sometimes it has a doc prefix, sometimes it doens't?
        try:
            return docs[doc_key].block_contents
        except:
            return docs['doc.' + doc_key].block_contents
    else:
        return text
