import React, { useEffect } from 'react'

import { IconButton, InputAdornment, TextField } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import { DocsTrackerField } from '../utils'

/*
 * Represents the mutable state of a text input field on the modal
 * @param value - the value of the text input
 * @param error - the error message to display
 * @param disabled - whether the text input is disabled
 */
type ModalState = {
  value: string
  error: string
  disabled: boolean
}

/*
 * Represents a text input field on the modal
 * @param fieldName - the name of the cookie to store the value in
 * @param inputRef - a ref to the text input, used to focus the input when the field is cleared
 * @param state - the state of the modal
 * @param setState - a function to update the state of the modal
 * @param clear - Clears the text input, sets the error to empty, removes from localStorage, and enables the text input
 * @param save - Saves the text input, sets the error to empty, adds to localStorage, and disables the text input
 * @param delete - Deletes the text input, sets the error to empty, removes from localStorage, and enables the text input
 * @param getError - Returns the error message for the text input
 */
type ModalInput = {
  fieldName: DocsTrackerField
  inputRef: React.RefObject<HTMLInputElement>
  state: ModalState
  setState: React.Dispatch<React.SetStateAction<ModalState>>
  clear: () => void
  saveToStorage: () => void
  removeFromStorage: () => void
}

const clearModalInput = (input: ModalInput) => {
  input.setState({
    value: '',
    error: '',
    disabled: false,
  })
  input.removeFromStorage()
}

/*
 * Creates a ModalInput object that can be used to create a modal input
 * @param name - the name of the input (e.g. collectorEndpoint or appId)
 * @param getError - a function that takes in the value of the input and returns an error string
 * @returns a ModalInput object
 */
export const createModalInput = (fieldName: DocsTrackerField): ModalInput => {
  let value = ''
  let disabled = false

  useEffect(() => {
    value = window.localStorage.getItem(fieldName) || ''
    disabled = Boolean(window.localStorage.getItem(fieldName))
    setState((prev: ModalState) => ({ ...prev, value, disabled }))
  }, [])

  const [state, setState] = React.useState<ModalState>({
    value,
    error: '',
    disabled,
  })

  let ret: ModalInput = {
    fieldName,
    inputRef: React.useRef<HTMLInputElement>(null),
    state,
    setState,
    clear: () => clearModalInput(ret),
    saveToStorage: () => {
      window.localStorage.setItem(ret.fieldName, ret.state.value)
      setState((prev) => ({ ...prev, disabled: true, error: '' }))
    },
    removeFromStorage: () => {
      window.localStorage.removeItem(ret.fieldName)
      setState((prev) => ({ ...prev, disabled: false, error: '' }))
    },
  }

  return ret
}

export const ModalTextField = (props: {
  label: string
  modalInput: ModalInput
}) => {
  return (
    <TextField
      ref={props.modalInput.inputRef}
      disabled={props.modalInput.state.disabled}
      sx={{ m: 1, mx: 0 }}
      margin="normal"
      fullWidth
      value={props.modalInput.state.value}
      onChange={(e) => {
        props.modalInput.setState((prev) => ({
          ...prev,
          value: e.target.value,
        }))
      }}
      label={props.label}
      error={Boolean(props.modalInput.state.error)}
      helperText={props.modalInput.state.error}
      InputProps={{
        endAdornment: props.modalInput.state.disabled && (
          <InputAdornment position="end">
            <IconButton
              edge="end"
              onClick={() => {
                props.modalInput.clear()
              }}
            >
              <ClearIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    ></TextField>
  )
}
