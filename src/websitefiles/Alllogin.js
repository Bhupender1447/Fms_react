import React, {useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";

const Alllogin = () => {
  const sectionRef = useRef(null);

  // Bubble effect on mouse move
  useEffect(() => {
    const section = sectionRef.current;

    const handleMouseMove = (e) => {
      if (e.target.closest(".login-card")) return;

      const bubblelogin = document.createElement("div");
      bubblelogin.classList.add("bubblelogin");
      bubblelogin.style.left = e.clientX + "px";
      bubblelogin.style.top = e.clientY + "px";
      section.appendChild(bubblelogin);

      setTimeout(() => {
        if (bubblelogin.parentNode === section) {
          section.removeChild(bubblelogin);
        }
      }, 800);
    };

    if (section) {
      section.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (section) {
        section.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  // Create floating bubbles
  useEffect(() => {
    const createFloatingBubbles = () => {
      const container = document.getElementById("login-bg");
      if (!container) return;

      // Clear existing bubbles
      const existingBubbles = container.querySelectorAll(".floating-bubble");
      existingBubbles.forEach((bubble) => bubble.remove());

      for (let i = 0; i < 20; i++) {
        const bubble = document.createElement("div");
        bubble.classList.add("floating-bubble");

        const size = Math.random() * 60 + 20; // 20px - 80px
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${Math.random() * 100}%`;
        bubble.style.animationDuration = `${8 + Math.random() * 10}s`;
        bubble.style.animationDelay = `${Math.random() * 5}s`;
        container.appendChild(bubble);
      }
    };

    createFloatingBubbles();
  }, []);



  const loginCards = [
    {
      title: "Login for Sessions",
      description: "Access session management dashboard",
      type: "internal",
      link: "/admin-login",
      icon: "fa-users",
    },
    {
      title: "Login for Drivers",
      description: "Driver portal and mobile app access",
      type: "external",
      link: "/driver-login",
      icon: "fa-truck",
    },
    {
      title: "Login for Agents",
      description: "Agent management and reporting",
      type: "internal",
      link: "/agents-login",
      icon: "fa-user-tie",
    },
  ];

  return (
    <>
      <section className="login-card-section" id="login-bg" ref={sectionRef}>
        <div className="container">
          <h1 className="login-title">Login</h1>

          {/* Login Cards */}
          <div className="row login-sections">
            {loginCards.map((card, index) => (
              <>
                <div key={index} className="col-md-4 mb-4">
                  <NavLink
                    to={card.link}
                    className="login-card-link"
                    style={{ textDecoration: "none" }}
                  >
                    <div className="login-card text-center main-login-hover">
                      <div className="card-icon">
                        <i
                          className={`fas ${
                            index === 0
                              ? "fa-users"
                              : index === 1
                              ? "fa-truck"
                              : "fa-user-tie"
                          }`}
                        ></i>
                      </div>
                      <h3>{card.title}</h3>
                      <p className="card-description">{card.description}</p>
                      <button className="card-action-btn">
                        Access Portal <i className="fas fa-arrow-right"></i>
                      </button>
                    </div>
                  </NavLink>
                </div>
              </>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Alllogin;
