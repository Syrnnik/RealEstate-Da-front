import React from "react";
import { NavLink } from "react-router-dom";

const TileServices = (props) => {
    return (
        <div className="tile">
            <NavLink to={`service/${props.slug}`}>
                <img src={props.img} />
                <div className="links">
                    <div className="title services-links">{props.name}</div>
                </div>
            </NavLink>
        </div>
    );
};

export default TileServices;
