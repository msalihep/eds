export default async function init(el) {
  const sheetPath = el.querySelector('a')?.getAttribute('href') || '/data/team-members.json';
  el.replaceChildren();

  try {
    const resp = await fetch(sheetPath);
    if (!resp.ok) throw new Error(`Failed to fetch ${sheetPath}`);
    const { data } = await resp.json();

    const grid = document.createElement('div');
    grid.className = 'team-members-grid';

    data.forEach((member) => {
      const card = document.createElement('div');
      card.className = 'team-members-card';

      if (member.Avatar) {
        const avatar = document.createElement('img');
        avatar.src = member.Avatar;
        avatar.alt = member.Name || 'Team member';
        avatar.loading = 'lazy';
        card.append(avatar);
      }

      const info = document.createElement('div');
      info.className = 'team-members-info';

      const name = document.createElement('h3');
      name.textContent = member.Name;

      const role = document.createElement('p');
      role.className = 'team-members-role';
      role.textContent = member.Role;

      const dept = document.createElement('p');
      dept.className = 'team-members-dept';
      dept.textContent = [member.Department, member.Location].filter(Boolean).join(' · ');

      info.append(name, role, dept);

      if (member.Email) {
        const email = document.createElement('a');
        email.href = `mailto:${member.Email}`;
        email.textContent = member.Email;
        email.className = 'team-members-email';
        info.append(email);
      }

      card.append(info);
      grid.append(card);
    });

    el.append(grid);
  } catch {
    el.textContent = 'Could not load team data.';
  }
}
