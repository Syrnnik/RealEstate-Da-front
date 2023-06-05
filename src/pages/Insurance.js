import React, { useEffect } from "react";
import Breadcrumbs from "../components/Breadcrumbs";
import { insurances } from "../helpers/insurances";

export default function Hypothec({ routeName }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main>
      <Breadcrumbs currentRouteName="Страхование" />

      <section className="sec-13 container mb-5">
        <h1 className="text-center text-md-start">
          Предложения по страхованию от банков-партнеров:
        </h1>
        <div className="row row-cols-2 row-cols-xl-4 g-2 g-sm-4">
          {insurances.map((company) => (
            <div>
              <div className="item shad-box-2 p-3 p-md-4">
                <img
                  src={`/img/${company.image}.png`}
                  alt={company.title}
                  className="img"
                />
                <h4 className="gray-1">{company.title}</h4>
                <a className="link" href={company.link} target="_blank">
                  {company.link}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
