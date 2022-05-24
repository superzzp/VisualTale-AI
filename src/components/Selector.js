import styled from "styled-components";
import Select from 'react-select';

function Selector (props) {
    const dataModelOptions = [
        { value: 'text-curie-001', label: 'Curie (Default)' },
        { value: 'text-davinci-002', label: 'Davinci' },
        { value: 'text-babbage-001', label: 'Babbage' },
        { value: 'text-ada-001', label: 'Ada' },
    ]
    const customSelectStyles = {
        option: (provided) => ({
          ...provided,
          padding: 10,
          backgroundColor: 'DodgerBlue',
          color: 'white',
          borderRadius: "0px",
        }),
        control: (provided) => ({
          ...provided,
          width: 230,
          backgroundColor: 'DodgerBlue',
          color: 'white',
          padding: '3px 0px',
          border: "none",
          boxShadow: "none",
          borderRadius: "0px"
        }),
        placeholder: (defaultStyles) => ({
          ...defaultStyles,
          color: 'white',
        }),
        singleValue: (defaultStyles) => ({
          ...defaultStyles,
          color: 'white',
        }),
    }

    return (
            <MainSelector>
                <Select placeholder="Data model (Optional)" options={dataModelOptions} styles={customSelectStyles}
                onChange={(e) => props.updateDataModel(e.value)}></Select>
            </MainSelector>
    );
}

const MainSelector = styled.div`
    display: inline-block;
    margin: 4px 2px;
`
const InfoPanel = styled.div`
    margin: 4px 2px;
    width: 100px;
    height:100px;
    backgroundColor: white;
    position: absolute;
`

export default Selector;
