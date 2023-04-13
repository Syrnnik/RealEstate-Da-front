import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

export default function Tile(props) {
    const [mob, setMob] = useState(false);
    const [visibility, setVisibility] = useState(false);

    useEffect(() => {
        if (props.activeTile === props.titles[0]) setVisibility(true);
        else setVisibility(false);
    });

    useEffect(() => {
        function changeTile() {
            if (window.matchMedia("(max-width: 991px)").matches) {
                setMob(true);
            } else {
                setMob(false);
            }
        }

        window.addEventListener("resize", changeTile);
        changeTile();
        return () => window.removeEventListener("resize", changeTile);
    }, []);

    const titles = props.titles;
    const hoverLinks = props.hoverLinks;

    if (mob) {
        return (
            <div className="tile" onClick={props.onClick}>
                <img src={props.img} alt="иконка" />
                <div className="links">
                    {props.simpleLink && (
                        <Link className="title" to={props.simpleLink.url}>
                            {props.simpleLink.title}
                        </Link>
                    )}
                    {titles &&
                        titles.map(function (item) {
                            return (
                                <div key={item} className="title">
                                    {item}
                                </div>
                            );
                        })}
                </div>
                {hoverLinks && (
                    <div className={visibility ? "click-links" : "click-links d-none"}>
                        <div className="titles mb-2 mb-sm-3">
                            {titles.map(function (item) {
                                return (
                                    <div key={item} className="title">
                                        {item}
                                    </div>
                                );
                            })}
                        </div>
                        <ul>
                            {hoverLinks.map(function (item, i) {
                                return (
                                    <li key={i}>
                                        <NavLink to={item.link}>{item.name}</NavLink>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </div>
        );
    } else {
        return (
            <div className="tile">
                <img src={props.img} alt="иконка" />
                <div className="links">
                    {props.simpleLink && (
                        <Link className="title" to={props.simpleLink.url}>
                            {props.simpleLink.title}
                        </Link>
                    )}
                    {titles &&
                        titles.map(function (item) {
                            return (
                                <div key={item} className="title">
                                    {item}
                                </div>
                            );
                        })}
                    {hoverLinks && (
                        <div className="hover-links">
                            {hoverLinks.map(function (item) {
                                return (
                                    <div key={item.name}>
                                        <NavLink to={item.link}>{item.name}</NavLink>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
