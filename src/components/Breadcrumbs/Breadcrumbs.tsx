import React, {   } from "react";
import { Link, useLocation } from "react-router-dom";
import { toTitleCase } from '../../utils/formatFunctions';


const Breadcrumbs: React.FC = () => {
  const crumbs = useLocation().pathname.split("/");

  // Don't render a single breadcrumb.
  if (crumbs.filter(el => el !== "").length < 1) {
    return null;
  }
  const arrowRight = <i key={"arrowRight"} className="arrow right mx-1" style={{ borderWidth: "0 1px 1px 0", transformOrigin: "bottom left" }}></i>

  const generateBreadCrumbs = (crumbs:Array<any>) => {
    return crumbs.map((name, key) => {
      let returnEl = []
      switch (key) {
        case 0:
          returnEl.push(
          <Link key={"home"} to={"/"} className="text-decoration-none">
            Home
          </Link>
          )
          key !== crumbs.length - 1 && returnEl.push(arrowRight)
          break;
        case crumbs.length - 1:
          returnEl.push(
            <span key={key} style={{
              textOverflow: 'ellipsis',
              overflow: 'hidden'}}
              className="text-decoration-none"
              >
              {toTitleCase(name.split("-").join(" "))}
            </span>
          )
          key !== crumbs.length - 1 && returnEl.push(arrowRight)
          break;
          default:
            returnEl.push(
              <Link key={name} to={crumbs.slice(0,key+1).join("/")} style={{
                textOverflow: 'ellipsis',
                overflow: 'hidden'}}
                className="text-decoration-none"
                >
                {toTitleCase(name.split("-").join(" "))}
              </Link>
            )
            key !== crumbs.length - 1 && returnEl.push(arrowRight)
          break;
      }
      return returnEl
    })
  }

  return (
    <div style={{fontSize: '.85rem', textOverflow: "ellipsis", overflow: "hidden"}}>{generateBreadCrumbs(crumbs)}</div>
  );
};
export default Breadcrumbs;