(() => {
  if (document.querySelector('[data-ai-chat-launcher]')) return;

  const styles = document.createElement('style');
  styles.textContent = `
    .ai-chat-launcher{position:fixed;right:22px;bottom:22px;z-index:120;border:0;border-radius:999px;padding:14px 18px;background:linear-gradient(135deg,var(--blue),#2563eb);color:#fff;font:800 14px Inter,sans-serif;box-shadow:0 16px 38px rgba(37,99,235,.38);cursor:pointer;display:flex;align-items:center;gap:9px}
    .ai-chat-launcher:hover{transform:translateY(-2px)}
    .ai-chat-window{position:fixed;right:22px;bottom:84px;z-index:121;width:min(390px,calc(100vw - 28px));max-height:min(620px,calc(100vh - 110px));display:none;flex-direction:column;border:1px solid var(--line);border-radius:22px;background:var(--card);box-shadow:var(--shadow);overflow:hidden}
    .ai-chat-window.open{display:flex}
    .ai-chat-header{display:flex;justify-content:space-between;align-items:center;gap:14px;padding:17px 18px;border-bottom:1px solid var(--line);background:linear-gradient(135deg,rgba(59,130,246,.16),rgba(6,182,212,.08))}
    .ai-chat-header strong{display:block;font-family:'Space Grotesk',Inter,sans-serif;font-size:18px}
    .ai-chat-header small{display:block;color:var(--muted)}
    .ai-chat-close{width:36px;height:36px;border-radius:10px;border:1px solid var(--line);background:var(--bg);color:var(--text);cursor:pointer}
    .ai-chat-body{padding:17px;overflow:auto}
    .ai-chat-message{padding:12px 14px;border-radius:15px;margin-bottom:11px;line-height:1.5}
    .ai-chat-message.bot{background:var(--bg2);color:var(--text);border:1px solid var(--line)}
    .ai-chat-message.user{background:rgba(59,130,246,.18);color:var(--text);margin-left:36px}
    .ai-chat-chips{display:flex;flex-wrap:wrap;gap:7px;margin:12px 0}
    .ai-chat-chips button{border:1px solid var(--line);background:var(--bg);color:var(--text);border-radius:999px;padding:7px 10px;cursor:pointer;font:700 12px Inter,sans-serif}
    .ai-chat-form{display:grid;grid-template-columns:1fr auto;gap:9px;padding:14px;border-top:1px solid var(--line)}
    .ai-chat-form input{min-width:0;border:1px solid var(--line);background:var(--bg);color:var(--text);border-radius:12px;padding:12px;font:inherit}
    .ai-chat-form button{border:0;border-radius:12px;padding:0 15px;background:var(--blue);color:#fff;font-weight:800;cursor:pointer}
    @media(max-width:620px){.ai-chat-launcher{right:14px;bottom:14px}.ai-chat-window{right:14px;bottom:74px}.ai-chat-form{grid-template-columns:1fr}.ai-chat-form button{min-height:42px}}
  `;
  document.head.appendChild(styles);

  const launcher = document.createElement('button');
  launcher.type = 'button';
  launcher.className = 'ai-chat-launcher';
  launcher.setAttribute('data-ai-chat-launcher', '');
  launcher.setAttribute('aria-expanded', 'false');
  launcher.setAttribute('aria-controls', 'ai-chat-window');
  launcher.innerHTML = '<span aria-hidden="true">✦</span> Ask Chris';

  const panel = document.createElement('section');
  panel.id = 'ai-chat-window';
  panel.className = 'ai-chat-window';
  panel.setAttribute('aria-label', 'Ask about Chris');
  panel.innerHTML = `
    <div class="ai-chat-header">
      <div><strong>Ask about Chris</strong><small>Career, technical background and interests</small></div>
      <button class="ai-chat-close" type="button" aria-label="Close chat">×</button>
    </div>
    <div class="ai-chat-body" aria-live="polite">
      <div class="ai-chat-message bot">Ask a full question or a quick fragment such as “years of sales,” “what IT does,” or “leadership.”</div>
      <div class="ai-chat-chips">
        <button type="button" data-question="years of sales">Years of sales</button>
        <button type="button" data-question="what IT does">What IT does</button>
        <button type="button" data-question="cybersecurity">Cybersecurity</button>
        <button type="button" data-question="leadership">Leadership</button>
      </div>
    </div>
    <form class="ai-chat-form">
      <input type="text" aria-label="Question about Chris" placeholder="Ask about Chris..." autocomplete="off" />
      <button type="submit">Ask</button>
    </form>
  `;

  document.body.append(panel, launcher);

  const body = panel.querySelector('.ai-chat-body');
  const form = panel.querySelector('.ai-chat-form');
  const input = form.querySelector('input');

  const open = () => {
    panel.classList.add('open');
    launcher.setAttribute('aria-expanded', 'true');
    setTimeout(() => input.focus(), 50);
  };

  const close = () => {
    panel.classList.remove('open');
    launcher.setAttribute('aria-expanded', 'false');
  };

  const submitQuestion = question => {
    const clean = question.trim();
    if (!clean) return;

    const userMessage = document.createElement('div');
    userMessage.className = 'ai-chat-message user';
    userMessage.textContent = clean;
    body.appendChild(userMessage);

    const botMessage = document.createElement('div');
    botMessage.className = 'ai-chat-message bot';
    botMessage.textContent = typeof answerQuestion === 'function'
      ? answerQuestion(clean)
      : 'The career assistant is temporarily unavailable. Please use the résumé or contact page.';
    body.appendChild(botMessage);

    input.value = '';
    body.scrollTop = body.scrollHeight;
  };

  launcher.addEventListener('click', () => panel.classList.contains('open') ? close() : open());
  panel.querySelector('.ai-chat-close').addEventListener('click', close);
  form.addEventListener('submit', event => {
    event.preventDefault();
    submitQuestion(input.value);
  });
  panel.querySelectorAll('[data-question]').forEach(button => {
    button.addEventListener('click', () => submitQuestion(button.dataset.question));
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') close();
  });
})();
