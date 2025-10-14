from dataclasses import dataclass, fields, field
from typing import Optional, Union
from copy import deepcopy
import re
import os
import requests
import json
from dbt_package_list import all_packages


def classFromArgs(className, argDict):
    fieldSet = {f.name for f in fields(className) if f.init}
    filteredArgDict = {k: v for k, v in argDict.items() if k in fieldSet}
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
    referenced_by: Optional[dict[list]] = field(
        default_factory=lambda: {'macros': [], 'nodes': []})
    type: Optional[str] = None

    def __post_init__(self):
        # Replace warehosue specific ones in prep for adding disabled models
        lang = self.get_lang()
        self.paths[lang] = self.original_file_path
        self.dispatched_sql[lang] = self.raw_code
        self.original_file_path = re.sub(
            'bigquery|snowflake|default|redshift\_postgres|redshift|postgres|databricks', '&lt;adaptor&gt;', self.original_file_path)
        # ensure all column names are lowercase
        temp_cols = deepcopy(self.columns)
        self.columns = {k.lower(): v for k, v in temp_cols.items()}

    def to_markdown(self, key, docs):
        """Generates the markdown for a dbt model

        Args:
            key (str): Full name of the model (key from master dict)
            docs (dict): Dictionary of docs objects for lookup

        Returns:
            str: A markdown string for the model
        """
        # Get all the information we need about the macro
        # If this was a disabled model we need to process from the actual docs
        description = get_doc(self.description, docs, key)
        dispatched_sql = self.dispatched_sql
        dispatched_filepath = self.paths
        columns = self.columns
        # Remove all integration test stuff from depends/refs, also de-dupe in case any made it through somehow
        depends_macros = list({x for x in self.depends_on.get(
            'macros') if 'integration_tests' not in x})
        depends_models = list({x for x in self.depends_on.get(
            'nodes') if 'integration_tests' not in x})
        referenced_by_macros = list(
            {x for x in self.referenced_by.get('macros') if 'integration_tests' not in x})
        referenced_by_models = list(
            {x for x in self.referenced_by.get('nodes') if 'integration_tests' not in x})

        # Set initial markdown, set specific header key
        markdown = [f'### {self.name.replace("_"," ").title()} {{#{key}}}',
                    '',
                    '<DbtDetails><summary>',
                    f'<code>{self.original_file_path}</code>',
                    '</summary>',
                    '',
                    '<h4>Description</h4>',
                    '']

        # Add the description
        if description != "":
            is_documented = True
            markdown.append(description)
        else:
            is_documented = False
            markdown.append(
                'This model does not currently have a description.')

        if self.type is not None:
            markdown.extend(['', f'**Type**: {self.type}'])
        # Add the file paths if it is adaptor split
        if '&lt;adaptor&gt;' in self.original_file_path:
            markdown.extend(['', '<h4>File Paths</h4>', ''])
            markdown.append('<Tabs groupId="dispatched_sql">')
            for lang in sorted(dispatched_filepath):
                markdown.extend(md_tab_val(
                    lang, None, f'`{dispatched_filepath[lang]}`', lang == "default", None))
            markdown.extend(['</Tabs>', ''])

        markdown.extend(['', '<h4>Details</h4>', ''])

        # Add columns
        if columns != {}:
            markdown.extend(['<DbtDetails>', '<summary>Columns</summary>', ''])
            if self.name.endswith('base_events_this_run'):
                markdown.extend(
                    [':::note', '', 'Base event this run table column lists may be incomplete and is missing contexts/unstructs, please check your warehouse for a more accurate column list.', '', ':::', ''])
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
            markdown.extend(md_tab_val(
                lang, link, dispatched_sql[lang], lang == "default", 'jinja2'))

        markdown.extend(['</Tabs>', ''])

        markdown.extend(['</DbtDetails>', ''])

        # Add the depends on references
        markdown.extend(md_X_by(depends_macros, depends_models, 'Depends On'))

        # Add referenced by
        markdown.extend(md_X_by(
            referenced_by_macros, referenced_by_models, 'Referenced By'))

        markdown.extend(['</DbtDetails>', ''])
        return '\n'.join(markdown), is_documented


@dataclass
class dbt_macro(dbt_base):
    macro_sql: str
    arguments: list[dict]
    is_dispatched: Optional[bool] = False
    dispatched_sql: Optional[dict] = field(default_factory=dict)
    referenced_by: Optional[dict[list]] = field(
        default_factory=lambda: {'macros': [], 'nodes': []})

    def __post_init__(self):
        if 'return(adapter.dispatch' in self.macro_sql.replace(' ', ''):
            self.is_dispatched = True

    def to_markdown(self, key: str, docs={}):
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
        depends_macros = list({x for x in self.depends_on.get(
            'macros') if 'integration_tests' not in x})
        referenced_by_macros = list(
            {x for x in self.referenced_by.get('macros') if 'integration_tests' not in x})
        referenced_by_models = list(
            {x for x in self.referenced_by.get('nodes') if 'integration_tests' not in x})

        # Set initial markdown, set specific header key
        markdown = [f'### {self.name.replace("_"," ").title()} {{#{key}}}',
                    '',
                    '<DbtDetails><summary>',
                    f'<code>{self.original_file_path}</code>',
                    '</summary>',
                    '',
                    '<h4>Description</h4>',
                    '']

        # Add the description
        if description != "":
            is_documented = True
            description.replace('\\n', '\\n\\n')
            # split once on the first level 4 header - see internal style guide
            description_parts = description.split('####', 1)
            markdown.append(description_parts[0])
        else:
            is_documented = False
            description_parts = []
            markdown.append(
                'This macro does not currently have a description.')

        # Add in argument details if there are any
        if self.arguments:
            markdown.extend(['', '<h4>Arguments</h4>', ''])
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
        # Introducing an incredible regex that Nick made and I don't even dream to understand
        if len(description_parts) > 1:
            markdown.extend(['', re.sub(
                "(#+) ([A-Z][a-z]+)", lambda x: f"<h{len(x.group(1))}>{x.group(2)}</h{len(x.group(1))}>\n", f'####{description_parts[1]}'), ''])

        markdown.extend(['', '<h4>Details</h4>', ''])
        # Add in the sql if there is any
        if sql != '':
            source_url = get_source_url(key, self.original_file_path)
            markdown.extend(['<DbtDetails>', f'<summary>Code</summary>', ''])
            if source_url is not None:
                link = f'<center><b><i><a href="{source_url}">Source</a></i></b></center>'
            else:
                link = ''
            markdown.extend([link, ''])
            if not dispatched_sql:
                markdown.extend(['```jinja2',
                                sql,
                                '```',
                                 ''
                                 ])
            # Use a tabs group for dispatced sql items
            else:
                markdown.append('<Tabs groupId="dispatched_sql">')
                markdown.extend(md_tab_val('raw', None, sql, True, 'jinja2'))
                for lang in sorted(dispatched_sql):
                    markdown.extend(md_tab_val(
                        lang, None, dispatched_sql[lang], False, 'jinja2'))

                markdown.extend(['</Tabs>', ''])

            markdown.extend(['</DbtDetails>', ''])

        # Add the depends on references
        # Macros can only depend on other macros
        markdown.extend(md_X_by(depends_macros, [], 'Depends On'))

        markdown.extend(md_X_by(
            referenced_by_macros, referenced_by_models, 'Referenced By'))

        markdown.extend(['</DbtDetails>', ''])
        return '\n'.join(markdown), is_documented


@dataclass
class dbt_catalog:
    metadata: dict
    columns: dict


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
        return merged_obj
    else:
        # Combine depends on and referenced by
        merged_obj.depends_on['macros'] = list(
            set(obj1.depends_on['macros'] + obj2.depends_on['macros']))
        merged_obj.referenced_by['macros'] = list(
            set(obj1.referenced_by['macros'] + obj2.referenced_by['macros']))
        merged_obj.referenced_by['nodes'] = list(
            set(obj1.referenced_by['nodes'] + obj2.referenced_by['nodes']))
        # Combine dispatched sql
        for sql in obj2.dispatched_sql:
            if sql not in merged_obj.dispatched_sql:
                merged_obj.dispatched_sql[sql] = obj2.dispatched_sql[sql]
        if type == 'model':
            merged_obj.depends_on['nodes'] = list(
                set(obj1.depends_on['nodes'] + obj2.depends_on['nodes']))
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
        matching_objs = [package.get(
            key) for package in packages if package.get(key) is not None]
        if matching_objs:
            combined_objects[key] = merge_dbt_objs(type, matching_objs)

    return combined_objects


def merge_manifest_and_catalog(models: dict, catalogs: dict) -> dict:
    """Merges a dictionary of models based on manifest files and catalog type objects

    Args:
        models (dict): A dictionary of models generated from manifest files
        catalogs (dict): A dictonary of catalog file objects

    Returns:
        dict: A copy of the models dictionary with information from the catalog.
    """

    models_copy = deepcopy(models)

    for model in models_copy:
        mod_cat = catalogs.get(model)
        # base events this run models are based off seeds, so we want to remove these and just keep hardcoded documentation from the package
        if mod_cat is not None and not model.endswith('base_events_this_run'):
            orig_cols = deepcopy(models_copy[model].columns)
            table_type = mod_cat.metadata.get('type')
            cat_cols = mod_cat.columns
            merged_cols = dict()
            for col_name, col_val in cat_cols.items():
                merged_cols[col_name.lower()] = col_val
                # Add back in the column description
                merged_cols[col_name.lower()]['description'] = orig_cols.get(
                    col_name.lower(), {}).get('description')
            models_copy[model].columns = merged_cols
            if table_type == 'BASE TABLE':
                models_copy[model].type = 'Table'
            else:
                models_copy[model].type = table_type.capitalize()

    return models_copy


def github_read_file(username: str, repository_name: str, file_path: str, ref: str, headers: dict) -> str:
    """Retruns the contets of a file from a github repo for a specific ref

    Args:
        username (str): Username of Organisation of the repo
        repository_name (str): Repo name
        file_path (str): Path to the file in the repo
        ref (str): Ref (branch or tag) to get the contents of
        headers (dict): Headers to send with request

    Returns:
        str: Contents of the file
    """
    headers['Accept'] = 'application/vnd.github.v3.raw'
    url = f'https://api.github.com/repos/{username}/{repository_name}/contents/{file_path}?ref={ref}'
    print(f'Fetching {url}')
    r = requests.get(url, headers=headers)
    r.raise_for_status()

    return r.text


def download_docs(packages: tuple[str, str], headers: dict) -> None:
    """Downloads manifest and catalog objects for all packages

    Args:
        packages (tuple): Tuple of packages to download contents from, the second value should be the repo name
        headers (dict): Headers to send with the request
    """
    # Create the manifest folder to write to
    if not (os.path.exists('./manifests')):
        os.makedirs('./manifests')

    # Get the latest manifest from each package
    for package in packages:
        manifest = github_read_file(
            'snowplow', package[1], 'docs/manifest.json', 'gh_pages', headers)
        catalog = github_read_file(
            'snowplow', package[1], 'docs/catalog.json', 'gh_pages', headers)

        with open(f'./manifests/{package[0].split("/")[1]}_manifest.json', 'w') as out_file:
            json.dump(json.loads(manifest), out_file)
        with open(f'./manifests/{package[0].split("/")[1]}_catalog.json', 'w') as out_file:
            json.dump(json.loads(catalog), out_file)


def get_referenced_by(imodels: dict[dbt_model], imacros: dict[dbt_macro]) -> tuple[dict[dbt_model], dict[dbt_macro]]:
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
                models[referenced_model_name].referenced_by['nodes'].append(
                    cur_model_name)

        # repeat again for macros
        for referenced_macro_name in references_macros:
            if macros.get(referenced_macro_name) is not None:
                macros[referenced_macro_name].referenced_by['nodes'].append(
                    cur_model_name)

    # Loop over macros, same as before except they cannot depend on a model
    for cur_macro_name, cur_macro in macros.items():
        references_macros = cur_macro.depends_on['macros']
        for referenced_macro_name in references_macros:
            if macros.get(referenced_macro_name) is not None:
                macros[referenced_macro_name].referenced_by['macros'].append(
                    cur_macro_name)

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
    possible_prefixes = ['default', 'snowflake', 'bigquery',
                         'databricks', 'spark', 'redshift', 'postgres']

    # Add the dispatched sql to the main thing
    for macro_key, macro_value in processed_macros.items():
        # Check if the sql contains a dispatcher
        if macro_value.is_dispatched:
            # chcek for each possible dispatched version
            for adaptor in possible_prefixes:
                # Get dispatched name and check if it exists
                adapted_macro_name = macro_key.replace(
                    macro_value.name, adaptor + '__' + macro_value.name)
                if processed_macros.get(adapted_macro_name) is None:
                    continue

                adaptor_sql = processed_macros.get(
                    adapted_macro_name).macro_sql
                # Depends on may be different for each adapator, so we need to bring them up to the dispatcher
                adaptor_depends_on = processed_macros.get(
                    adapted_macro_name).depends_on.get('macros')

                # Update the sql if there is any
                if adaptor_sql is not None:
                    processed_macros[macro_key].dispatched_sql[adaptor] = adaptor_sql

                # add children depends on a
                if adaptor_depends_on is not None and adaptor_depends_on != []:
                    new_depend_on_macros = list(
                        set(processed_macros[macro_key].depends_on.get('macros') + adaptor_depends_on))
                    processed_macros[macro_key].depends_on['macros'] = new_depend_on_macros
            # remove any adaptor specific depends on
            processed_macros[macro_key].depends_on['macros'] = [
                x for x in processed_macros[macro_key].depends_on['macros'] if '__' not in x]

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
                   '',
                   'export function DbtDetails(props) {',
                   'return <div className="dbt"><details>{props.children}</details></div>',
                   '}',
                   "```",
                   '',
                   ':::warning',
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
        cut_objects = {k: v for k,
                       v in objects.items() if filter_key + '.' in k}
    else:
        cut_objects = {k: v for k, v in objects.items()}

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
        if (not show_docs) or ('integration_tests' in object):
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
    """Gets the package url for a macro (also works for models!) key.

    Args:
        macrokey (str): a key value for the macro you want the url of
        path (str): The path of the file within the package

    Returns:
        str: Full url for the file
    """
    url = 'https://github.com/snowplow/'
    match = False
    for pkg in all_packages:
        # just check package name is in the key, but ending with . to ensure it's not in macro name
        if pkg[0].split('/')[1] + '.' in macrokey:
            url += pkg[1]
            match = True

    if not match:
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

    type_exists = any([x.get('type') for x in columns.values()])
    if type_exists:
        table_str = ['| Column Name | Description |Type|',
                     '|:------------|:------------|:--:|']
        for col in columns.values():
            col_name = col.get('name').lower()
            col_desc = get_doc(col.get('description'), docs,
                               key) or col.get('comment')
            col_type = col.get('type').lower()
            table_str.append(
                f'| {col_name} | {col_desc if col_desc is not None else " "} | {col_type if col_type is not None else " "} |')
    else:
        table_str = ['| Column Name | Description |',
                     '|:------------|:------------|']
        for col in columns.values():
            col_name = col.get('name').lower()
            col_desc = get_doc(col.get('description'), docs, key)
            table_str.append(
                f'| {col_name} | {col_desc if col_desc is not None else " "} |')

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
    if text is not None and '{{ doc("' in text:
        package = key.split('.')[1]
        doc_name = text.split('"')[1]
        doc_key = package + '.' + doc_name
        # Sometimes it has a doc prefix, won't have if produced pre-version 1.4, should be okay to remove in the future
        try:
            return docs[doc_key].block_contents
        except:
            return docs['doc.' + doc_key].block_contents
    else:
        return text


def md_X_by_list(X: list, type: str) -> list:
    """Returns the code for a list of links to other macros/models

    Args:
        X (list): List of objects (models or macros) to list
        type (str): Type of objects, one of model or macro

    Raises:
        ValueError: If type is not one of the valid options

    Returns:
        list: Markdown of objects listed with correct links
    """
    md = []
    if type not in ['model', 'macro']:
        raise ValueError('Non-supported type in call')
    md.extend([f'<TabItem value="{type}" label="{type.title()}s">', ''])
    for y in sorted(X):
        if 'snowplow_' in y:
            package = y.split('.')[1]
            md.append(
                f'- [{y}](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/{package}/{type}s/index.md#{y})')
        else:
            md.append(f'- {y}')
    md.extend(['', '</TabItem>'])

    return md


def md_X_by(macros: list, models: list, header: str) -> list:
    """Generates a list block of markdown for the provided models and macros

    Args:
        macros (list): List of macro names
        models (list): List of model names
        header (str): Header for the section

    Returns:
        list: Markdown of referenced objects
    """
    md = []
    if macros or models:
        md.extend(['', f'<h4>{header}</h4>', ''])
        # Generate a tab group even if there is only one of the types, just for consistency
        md.append('<Tabs groupId="reference">')

        if models:
            md.extend(md_X_by_list(models, 'model'))

        if macros:
            md.extend(md_X_by_list(macros, 'macro'))

        md.append('</Tabs>')

    return md


def md_tab_val(lang: str, link: str, val: str, default: bool, syn: str) -> list:
    """Generates markdown for a tabitem with specified values

    Args:
        lang (str): Language of the value to apple as the value and the label
        link (str): Link html, if required
        val (str): Value to add to the tab item
        default (bool): Should this item be the default for the group?
        syn (str): Syntax language to apply to the value

    Returns:
        list: Markdown of the tabitem
    """
    md = []
    md.extend(
        [f'<TabItem value="{lang}" label="{lang}"{" default" if default else ""}>', ''])
    if link:
        md.extend([link, ''])
    if syn:
        md.extend([f'```{syn}', val, '```', '', '</TabItem>'])
    else:
        md.extend([val, '', '</TabItem>'])
    return md
