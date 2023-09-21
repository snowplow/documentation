If you make a breaking schema change (e.g. change a type of a field from a `string` to a `number`) without creating a new major schema version, the loader will not be able to modify the column to accommodate the new data.

In this case, _upon receiving the first event with the offending schema_, the loader will instead create a new column, with a name like `unstruct_event_com_example_button_press_1_0_1_recovered_9999999`, where:
* `1-0-1` is the version of the offending schema
* `9999999` is a hash code unique to the schema (i.e. it will change if the schema is overwritten with a different one)

To resolve this situation:
* Create a new schema version (e.g. `1-0-2`) that reverts the offending changes and is again compatible with the original column. The data for events with that schema will start going to the original column as expected.
* You might also want to manually adapt the data in the `..._recovered_...` column and copy it to the original one.
