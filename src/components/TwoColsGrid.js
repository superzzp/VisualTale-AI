import styled from "styled-components";

function TwoColsGrid(props) {
    return (
        <GridContainer>
            <FirstColGrid>Prompt:</FirstColGrid>
            <div>{props.prompt}</div>
            <FirstColGrid>Response:</FirstColGrid>
            <div>{props.response}</div>
        </GridContainer>
    );
}

const GridContainer = styled.div`
    display: grid;
    grid-template-columns: 25% 75%;
    margin: 20px 0px 0px 0px;
    padding: 20px;
    color: white;
    background-color: #234099;
    row-gap: 10px;
    border-radius: 5px;
`

const FirstColGrid = styled.div`
    font-weight: bold;
`
export default TwoColsGrid;
