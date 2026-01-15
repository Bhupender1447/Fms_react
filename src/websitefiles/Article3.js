import { Link } from "react-router-dom";

const Article3 = () => {
  return (
    <section className="blog-banner-section">
      <div className="container">
        <div className="row blog section">
          <div
            className="col-md-6 right-side-blog"
            style={{ opacity: "1 !important", transform: "translate(0)" }}
          >
            <div className="image-blog-1">
              <img src="images/blog-3.png" alt="" />
            </div>
          </div>
          <div
            className="col-md-6 left-side-blog"
            style={{ opacity: "1 !important", transform: "translate(0)" }}
          >
            <div className="text-side-container">
              <div className=" text-side-container-title">
                <h2>
                  Sustainability in transportation: how efficient load planning
                  helps reduce environmental impacts
                </h2>
              </div>
              <div className="text-side-container-title-date">
                <span>February 15, 2025</span>
              </div>
              <div className="text-side-container-title-data">
                <p>
                  {" "}
                  Freight transportation is an essential part of the global
                  economy, where various goods and products are transported to
                  different locations to maintain supplies. However, it is one
                  of the most damaging sectors due to its greenhouse gas
                  emissions and the consequent consumption of natural resources.
                  Therefore, to minimize such environmental impacts, it is
                  necessary to adopt sustainable solutions in its planning. The
                  use of optimized routes, the full capacity of vehicles and the
                  use of clean technologies are some of the solutions that make
                  transportation more efficient and environmentally friendly. In
                  this article, the relationship between sustainability and
                  freight planning is addressed based on the logistics solutions
                  that can reduce the impact of such activity on the
                  environment.
                </p>
              </div>
              <div className="text-side-container-subtitle">
                <h2>The environmental impact of freight transport</h2>
              </div>
              <div className="text-side-container-title-data">
                <p>
                  {" "}
                  As one of the largest emitters of CO2, the freight transport
                  sector is responsible for around 14% of global greenhouse gas
                  emissions, according to the International Energy Agency (IEA).
                  However, the main factors contributing to this figure are:
                </p>
              </div>
              <div className="main-function-section">
                {/* <div class="text-side-container-subtitle">
                     <h2> Isovia Inc.</h2>
                     <p>Isovia Inc. is an innovation technology company, with a future AI management, dedicated to transforming the freight management and logistics sector. The goal is to become a leader in providing advanced software system solutions for transportation and logistics corporations. The organization's first product, which is the basis of its vision, is Isovia Freight/Fleet Manager (IFM), which enables small and medium-sized companies to optimize operations and increase productivity through exclusive technology. In the future, the company intends to constantly evolve IFM to integrate AI-generated features for safety, compliance and operational efficiency.</p>

                  </div> */}
                {/* <div class="text-side-container-subtitle">
                      <h2>Overview of Isovia Inc. in the logistics sector</h2>
                     <P>Companies are increasingly adopting technologies to improve operations, and this is now growing in the freight system. Therefore, Isovia Inc., in light of this market vision, is operating in the freight system and logistics operations to meet the demands of this sector. Therefore, as companies further optimize their operations, the software platforms will expand.</p>

                  </div> */}
                {/* <div class="text-side-container-subtitle">
                      <h2>Isovia Freight/Fleet Manager (IFM)</h2>
                     <p>Isovia Freight/Fleet Manager (IFM) is the foundation of Isovia Inc.’s products, offering a single platform designed to streamline operations that manage freight and fleet systems. With the future integration of AI, IFM collects real-time data and analyzes it in advance to empower trucking companies, improve route planning, reduce operating costs, and increase safety. With a vision of continuous improvement, IFM is poised to evolve into a meaningful logistics solution, adding advanced features such as AI-enabled security tools and systems, cargo scheduling expertise, and partnerships with leading corporations.</p>

                  </div> */}
                <div className="text-side-container-main-data">
                  <ul className="list-main-sec">
                    <Link to="#" className="main-setion-list-anchor">
                      <li className="main-list-item">
                        <span>Burning of fossil fuels:</span>
                        cars, planes and ships use fuels derived from petroleum,
                        which generates large pollutants.
                      </li>
                    </Link>
                    <Link to="#" className="main-setion-list-anchor">
                      <li className="main-list-item">
                        <span>Logistics inefficiency:</span>
                        occurs with poor freight transport planning, which
                        causes unnecessary trips, increased pollutant emissions
                        and high fuel consumption.
                      </li>
                    </Link>
                    <Link to="#" className="main-setion-list-anchor">
                      <li className="main-list-item">
                        <span>Underutilization of vehicle capacity: </span>
                        vehicles travel with a limited amount of cargo, which
                        generates transport inefficiency and carbon credits per
                        unit transported.
                        <br />
                        Therefore, the concern is that 80% of freight transport
                        is subject to fossil fuels, including light diesel,
                        extra light diesel and safe marine diesel.
                      </li>
                    </Link>
                  </ul>
                </div>
              </div>
              <div className="text-side-container-main-data">
                <h2>mportance of Sustainable Freight Planning</h2>
                <p>
                  Sustainable logistics is becoming a main strategy to reduce
                  the environmental impacts of freight transportation. Among the
                  main sustainable practices, the following stand out:
                </p>
                <ol className="list-main-sec">
                  <Link to="#" className="main-setion-list-anchor">
                    <li className="main-list-item">
                      <h2>Route Optimization</h2>
                      <p>
                        The adoption of this method can significantly reduce
                        travel time and fuel consumption. Technologies based on
                        Artificial Intelligence and Big Data will calculate the
                        best routes with greater precision in real time,
                        avoiding congestion and reducing vehicle time.
                      </p>
                    </li>
                  </Link>
                  <Link to="#" className="main-setion-list-anchor">
                    <li className="main-list-item">
                      <h2>Efficient use of vehicle capacity</h2>
                      <p>
                        When trucks, ships and planes are ensured to work close
                        to their maximum capacity, the number of trips involving
                        the volume of cargo transported can be effectively
                        reduced. Cooperation between companies and the
                        implementation of strategies for the insertion of cargo
                        favors efficiency.
                      </p>
                    </li>
                  </Link>
                  <Link to="#" className="main-setion-list-anchor">
                    <li className="main-list-item">
                      <h2>Adoption of sustainable vehicles</h2>
                      <p>
                        The insertion of traditional vehicles such as electric,
                        hybrid or biodiesel and natural gas powered vehicles
                        helps to contain CO2 emissions and other atmospheric
                        pollutants.
                      </p>
                    </li>
                  </Link>
                  <Link to="#" className="main-setion-list-anchor">
                    <li className="main-list-item">
                      <h2>Monitoring and Preventive Maintenance</h2>
                      <p>
                        Regular maintenance of vehicles is necessary to ensure
                        energy efficiency and reduced fuel consumption. The use
                        of technologies that allow remote measurement and
                        sensors allows regular monitoring of vehicle
                        performance, which facilitates the identification of
                        mechanical failures that can emit more pollutants and
                        further increase fuel consumption.
                      </p>
                    </li>
                  </Link>
                  <Link to="#" className="main-setion-list-anchor">
                    <li className="main-list-item">
                      <h2>Technology and Automation</h2>
                      <p>
                        The use of technological logistics processes provides
                        more precise cargo management and operations. Integrated
                        platforms facilitate communication between carriers,
                        suppliers and customers, which brings more
                        sustainability to the process.
                      </p>
                    </li>
                  </Link>
                </ol>
              </div>
              <div className="benefits-option-function-section">
                <div className="text-side-container-subtitle">
                  <h2> Benefits of sustainability in cargo transportation</h2>
                  <p>
                    Planning sustainable practices in the cargo system reduces
                    environmental impact and provides benefits to society and
                    companies, such as:
                  </p>
                </div>
                <div className="text-side-container-main-data">
                  <ul className="list-main-sec">
                    <Link to="#" className="main-setion-list-anchor">
                      <li className="main-list-item">
                        <span>Increased logistics efficiency:</span>provides
                        fast, efficient deliveries and greater customer
                        satisfaction.
                      </li>
                    </Link>
                    <Link to="#" className="main-setion-list-anchor">
                      <li className="main-list-item">
                        <span>Good corporate image: </span>companies that use
                        sustainable systems are well regarded by consumers and
                        the market.
                      </li>
                    </Link>
                    <Link to="#" className="main-setion-list-anchor">
                      <li className="main-list-item">
                        <span>Reduced administrative costs: </span>
                        generates lower fuel consumption and reduced operating
                        expenses.
                      </li>
                    </Link>
                    <Link to="#" className="main-setion-list-anchor">
                      <li className="main-list-item conslusion-">
                        Advanced financial reporting for the logistics system
                      </li>
                    </Link>
                    <Link to="#" className="main-setion-list-anchor">
                      <li className="main-list-item conslusion-">
                        <span>Compliance with environmental standards: </span>
                        the application of sustainability ensures that penalties
                        are applied and environmental standards are complied
                        with.
                      </li>
                    </Link>
                    <li className="main-list-item conslusion-">
                      <h2 className="Conclusion">Conclusion</h2>
                      <p>
                        The IFM software from Isovia Inc. is the solution for
                        companies seeking to ensure efficiency in their
                        logistics processes. By implementing this real-time
                        monitoring system, it is possible to determine the
                        current status of routes, real information about when a
                        command is issued and management. Therefore, by adopting
                        this technology, organizations can reduce costs,
                        increase operational efficiency and improve security,
                        which strengthens their position in the competitive
                        logistics market.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Article3;
