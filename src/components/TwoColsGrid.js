import "./TwoColsGrid.css";

function TwoColsGrid (props) {
    return (
        <div className="response">
            <div className="col1">Prompt:</div>
            <div className="col2">{props.prompt}</div>
            <div className="col1">Response:</div>
            <div className="col2">{props.response}</div>
        </div>
    );
}

export default TwoColsGrid;
