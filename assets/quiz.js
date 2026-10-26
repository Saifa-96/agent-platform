/* quiz.js — 可复用测验组件。
 * 用法：lesson 中写
 *   <div class="quiz" data-answer="2">        ← 正确项的序号（1 起）
 *     <div class="q">问题</div>
 *     <ol class="opts"><li>A</li><li>B</li>…</ol>
 *     <div class="feedback" data-yes="对的原因" data-no="错的提示"></div>
 *   </div>
 * 点击选项立即反馈；答对后锁定该题。答案不进 HTML 属性明文之外的形式。
 */
(function () {
  document.querySelectorAll('.quiz').forEach(function (quiz) {
    var answer = parseInt(quiz.dataset.answer, 10)
    var opts = quiz.querySelectorAll('ol.opts li')
    var feedback = quiz.querySelector('.feedback')
    var locked = false

    opts.forEach(function (li, i) {
      li.setAttribute('role', 'button')
      li.setAttribute('tabindex', '0')
      function choose() {
        if (locked) return
        if (i + 1 === answer) {
          li.classList.add('correct')
          feedback.textContent = '✓ ' + (feedback.dataset.yes || '正确。')
          feedback.style.color = 'var(--ok)'
          locked = true
        } else {
          li.classList.add('wrong')
          feedback.textContent = '✗ ' + (feedback.dataset.no || '再想想。')
          feedback.style.color = 'var(--bad)'
          setTimeout(function () { li.classList.remove('wrong') }, 900)
        }
      }
      li.addEventListener('click', choose)
      li.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose() }
      })
    })
  })
})()
