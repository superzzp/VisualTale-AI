import styled from "styled-components";
import Select from 'react-select';

function Selector (props) {
    const customSelectStyles = {
        option: (provided) => ({
          ...provided,
          height: 30,
          backgroundColor: 'DodgerBlue',
          color: 'white',
          fontSize: "14px",
          "&:hover": {
            backgroundColor: "royalBlue"
          }
        }),
        control: (provided) => ({
          ...provided,
          width: props.width,
          height: 30,
          backgroundColor: 'DodgerBlue',
          color: 'white',
          border: "none",
          boxShadow: "none",
          borderRadius: "5px",
          fontSize: "14px",
          "&:hover": {
            backgroundColor: "royalBlue"
          }
        }),
        placeholder: (defaultStyles) => ({
          ...defaultStyles,
          color: 'white',
          fontSize: "14px"
        }),
        singleValue: (defaultStyles) => ({
          ...defaultStyles,
          color: 'white',
          fontSize: "14px"
        }),
    }

    return (
            <MainSelector>
                <Select placeholder={props.placeholderText} options={props.options} styles={customSelectStyles} defaultValue = {props.default}
                onChange={(e) => props.onSelectorChange(e.value)}></Select>
            </MainSelector>
    );
}

const MainSelector = styled.div`
    display: inline-block;
`

export default Selector;
