import React, { useState } from 'react'
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

export const SchemaSetter = (props) => {
    const [manifestSchema, setManifestSchema] = useState('my_manifest_schema')
    const [scratchSchema, setScratchSchema] = useState('my_scratch_schema')
    const [derivedSchema, setDerivedSchema] = useState('my_derived_schema')
    return (
        <>
            <Box sx={{ justifyContent: 'space-between', display: 'flex' }}>
                <TextField
                    placeholder="my_manifest_schema"
                    type="text"
                    id="manifest"
                    label="Manifest Schema Suffix"
                    margin="dense"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    onChange={() => setManifestSchema(event.target.value)}
                />
                <TextField
                    placeholder="my_scratch_schema"
                    type="text"
                    id="scratch"
                    label="Scratch Schema Suffix"
                    margin="dense"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    onChange={() => setScratchSchema(event.target.value)}
                />
                <TextField
                    placeholder="my_derived_schema"
                    type="text"
                    id="derived"
                    label="Derived Schema Suffix"
                    margin="dense"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    onChange={() => setDerivedSchema(event.target.value)}
                />
            </Box>
            {props.output(manifestSchema, scratchSchema, derivedSchema)}
        </>
    )
};
