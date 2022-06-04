import styled from "styled-components";
import Select from 'react-select';

function Selector (props) {
    
    const customSelectStyles = {
        option: (provided) => ({
          ...provided,
          height: 30,
          backgroundColor: 'DodgerBlue',
          color: 'white',
          borderRadius: "0px",
          fontSize: "14px"
        }),
        control: (provided) => ({
          ...provided,
          width: 200,
          height: 30,
          backgroundColor: 'DodgerBlue',
          color: 'white',
          border: "none",
          boxShadow: "none",
          borderRadius: "0px",
          fontSize: "14px"
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
                <Select placeholder={props.placeholderText} options={props.options} styles={customSelectStyles}
                onChange={(e) => props.onSelectorChange(e.value)}></Select>
            </MainSelector>
    );
}

const MainSelector = styled.div`
    display: inline-block;
    margin: 4px 2px;
`

export default Selector;
