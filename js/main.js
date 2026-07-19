/* ==========================================================================
   VR Info Tech - Main JavaScript Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize AOS (Animate on Scroll)
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 1000,
      easing: 'ease-out-cubic',
      once: true,
      offset: 120
    });
  }

  // 2. Navbar Scroll Behavior
  const navbar = document.querySelector('.navbar-premium');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check on load

  // 3. Interactive Floating Orbs - Mouse Movement Influence
  const orbs = document.querySelectorAll('.orb');
  window.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    orbs.forEach((orb, index) => {
      const speed = (index + 1) * 15;
      const x = (mouseX - 0.5) * speed;
      const y = (mouseY - 0.5) * speed;
      orb.style.transform = `translate(${x}px, ${y}px)`;
    });
  });

  // 4. GSAP Hero Animations
  if (typeof gsap !== 'undefined') {
    const tl = gsap.timeline();
    tl.from('.hero-tag', { duration: 0.8, y: -20, opacity: 0, ease: 'power3.out' })
      .from('.hero-title-main', { duration: 0.8, y: 30, opacity: 0, ease: 'power3.out' }, '-=0.5')
      .from('.hero-desc', { duration: 0.8, y: 20, opacity: 0, ease: 'power3.out' }, '-=0.6')
      .from('.hero-buttons', { duration: 0.8, y: 15, opacity: 0, ease: 'power3.out' }, '-=0.6')
      .from('.hero-visual', { duration: 1.2, scale: 0.9, opacity: 0, ease: 'elastic.out(1, 0.75)' }, '-=0.8');
  }

  // 5. Statistics Counter with Intersection Observer
  const statsSection = document.getElementById('stats-section');
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  const animateStats = () => {
    statNumbers.forEach((statNumber) => {
      const target = parseInt(statNumber.getAttribute('data-target'), 10);
      const suffix = statNumber.getAttribute('data-suffix') || '';
      const duration = 2000; // ms
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // Easing function outQuad
        const easeProgress = progress * (2 - progress);
        const currentValue = Math.floor(easeProgress * target);
        
        statNumber.textContent = currentValue.toLocaleString() + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          statNumber.textContent = target.toLocaleString() + suffix;
        }
      };

      requestAnimationFrame(updateCounter);
    });
  };

  if (statsSection && statNumbers.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animated) {
          animateStats();
          animated = true;
        }
      });
    }, { threshold: 0.3 });

    observer.observe(statsSection);
  }

  // 6. Technology Category Switching
  const techTabBtns = document.querySelectorAll('.tech-tab-btn');
  const techGridItems = document.querySelectorAll('.tech-item, .filter-item');

  techTabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetCategory = btn.getAttribute('data-category');
      
      // Toggle active classes on buttons
      techTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter grid items with smooth scaling/opacity animation
      techGridItems.forEach((item) => {
        const itemCategory = item.getAttribute('data-category');
        if (targetCategory === 'all' || itemCategory === targetCategory) {
          item.style.display = 'flex';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // 7. Swiper Initialization (Portfolio Slider)
  if (typeof Swiper !== 'undefined') {
    new Swiper('.swiper-portfolio', {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination-portfolio',
        clickable: true,
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
        },
        992: {
          slidesPerView: 3,
        }
      }
    });

    // 7.5. Swiper Initialization (Solutions Slider)
    new Swiper('.swiper-solutions', {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination-solutions',
        clickable: true,
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
        },
        1200: {
          slidesPerView: 3,
        }
      }
    });

    // 8. Swiper Initialization (Testimonials Slider)
    new Swiper('.swiper-testimonials', {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      autoplay: {
        delay: 6000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination-testimonials',
        clickable: true,
      },
      breakpoints: {
        992: {
          slidesPerView: 2,
        }
      }
    });
  }

  // Helper to load EmailJS dynamically
  const loadEmailJS = () => {
    return new Promise((resolve) => {
      if (window.emailjs) {
        resolve(window.emailjs);
        return;
      }
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
      script.onload = () => {
        window.emailjs.init("iArbp2eiz6tBoTqE1"); // Public Key
        resolve(window.emailjs);
      };
      document.head.appendChild(script);
    });
  };

  // Pre-load EmailJS
  loadEmailJS();

  // 9. Contact Form Handling (index.html)
  const contactForm = document.getElementById('contactForm');
  const toastNotification = document.getElementById('toastNotification');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Get fields
      const nameInput = document.getElementById("contactName").value.trim();
      const emailInput = document.getElementById("contactEmail").value.trim();
      const companyInput = document.getElementById("contactCompany") ? document.getElementById("contactCompany").value.trim() : "";
      const interestSelect = document.getElementById("contactInterest");
      const interestText = interestSelect ? interestSelect.options[interestSelect.selectedIndex].text : "";
      const messageInput = document.getElementById("contactMessage").value.trim();

      // Validations
      if (!nameInput || !emailInput || !messageInput) {
        alert("❌ Please fill in all required fields.");
        return;
      }

      const now = new Date();
      const formattedTime = now.toLocaleString('en-IN');

      const subjectLine = `New Inquiry: ${interestText || 'General'} Proposal`;
      const detailedMessage = `Company Name: ${companyInput || 'Not Specified'}\n` +
        `Primary Engineering Area: ${interestText || 'Not Specified'}\n\n` +
        `Client Message Details:\n${messageInput}`;

      const params = {
        from_name: nameInput,
        from_email: emailInput,
        subject: subjectLine,
        message: detailedMessage,
        time: formattedTime
      };

      const serviceID = "service_g64f7sq";
      const templateID = "template_mwpt1vn";

      // Show loading state
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending Proposal...`;

      loadEmailJS().then((emailjs) => {
        emailjs.send(serviceID, templateID, params)
          .then(() => {
            // Show Success Toast
            if (toastNotification) {
              toastNotification.classList.add('active');
              setTimeout(() => {
                toastNotification.classList.remove('active');
              }, 5000);
            }
            alert("✅ Proposal submitted successfully! Our consulting engineers will respond within 24 hours.");
            contactForm.reset();
          })
          .catch((error) => {
            console.error("❌ EmailJS Error:", error);
            alert("Something went wrong. Please try again or email us directly at vrinfotech39@gmail.com");
          })
          .finally(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
          });
      });
    });
  }

  // 9.5. Sidebar Consult Form Handling (service-details.html)
  const sidebarConsultForm = document.getElementById('sidebarConsultForm');
  if (sidebarConsultForm) {
    sidebarConsultForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Get fields
      const nameInput = document.getElementById("scName").value.trim();
      const emailInput = document.getElementById("scEmail").value.trim();
      const messageInput = document.getElementById("scMsg").value.trim();

      // Validations
      if (!nameInput || !emailInput || !messageInput) {
        alert("❌ Please fill in all required fields.");
        return;
      }

      const now = new Date();
      const formattedTime = now.toLocaleString('en-IN');

      const subjectLine = `New Architectural Scope Consultation Request`;
      const detailedMessage = `Client Message Details:\n${messageInput}`;

      const params = {
        from_name: nameInput,
        from_email: emailInput,
        subject: subjectLine,
        message: detailedMessage,
        time: formattedTime
      };

      const serviceID = "service_g64f7sq";
      const templateID = "template_mwpt1vn";

      // Show loading state
      const submitBtn = sidebarConsultForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending Request...`;

      loadEmailJS().then((emailjs) => {
        emailjs.send(serviceID, templateID, params)
          .then(() => {
            alert('✅ Thank you for reaching out. A systems architect will email you within 24 hours to schedule the session.');
            sidebarConsultForm.reset();
          })
          .catch((error) => {
            console.error("❌ EmailJS Error:", error);
            alert("Something went wrong. Please try again or email us directly at vrinfotech39@gmail.com");
          })
          .finally(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
          });
      });
    });
  }

  // 10. Newsletter Form Handling (All pages)
  const newsletterForm = document.querySelector('.footer-newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      if (emailInput && emailInput.value) {
        const emailValue = emailInput.value.trim();
        const now = new Date();
        const formattedTime = now.toLocaleString('en-IN');

        const params = {
          from_name: "Newsletter Subscriber",
          from_email: emailValue,
          subject: "New Newsletter Subscription Request",
          message: `A client has requested to subscribe to the newsletter.\nEmail: ${emailValue}`,
          time: formattedTime
        };

        const serviceID = "service_g64f7sq";
        const templateID = "template_mwpt1vn";

        // Show loading state
        const submitBtn = newsletterForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;

        loadEmailJS().then((emailjs) => {
          emailjs.send(serviceID, templateID, params)
            .then(() => {
              alert(`✅ Thank you for subscribing with: ${emailValue}!`);
              newsletterForm.reset();
            })
            .catch((error) => {
              console.error("❌ EmailJS Error:", error);
              alert("Something went wrong. Please try again.");
            })
            .finally(() => {
              submitBtn.disabled = false;
              submitBtn.innerHTML = originalBtnText;
            });
        });
      }
    });
  }
});

// Helper function to close toast notification
function closeToast() {
  const toastNotification = document.getElementById('toastNotification');
  if (toastNotification) {
    toastNotification.classList.remove('active');
  }
}
