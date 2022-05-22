import { css } from "@emotion/react";
import ClipLoader from "react-spinners/ClipLoader";

function Spinner (props) {
    const customLoaderStyles = css`
    display: block;
    position: relative;
    margin: 20px auto;
    `;
    return (
        <ClipLoader color={props.color} loading={props.loading} size={props.size} css={customLoaderStyles} />
    );
}

export default Spinner;
