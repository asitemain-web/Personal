// Contact cards rendering
function renderContactCards() {
  const contactCardsContainer = document.querySelector(".contact-cards");
  if (!contactCardsContainer || !contactData) return;

  contactCardsContainer.innerHTML = contactData
    .map((contact) => {
      const isEmail = contact.link.startsWith("mailto:");
      const cardStyle = `text-decoration: none;${isEmail ? " display: block;" : ""}`;
      const targetAttr = isEmail ? "" : 'target="_blank" rel="noopener"';

      return `
            <a class="contact-card" href="${contact.link}" ${targetAttr} style="${cardStyle}">
                <div class="contact-card-header">
                    <div class="contact-icon">
                        <img src="${contact.icon}" alt="${contact.iconAlt}">
                    </div>
                    <h3>${contact.name}</h3>
                </div>
                <p>${contact.username}</p>
            </a>
        `;
    })
    .join("");
}

function initContact() {
  renderContactCards();
}
