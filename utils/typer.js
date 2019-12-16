function Typer(el, { html, duration = 100 }, callback) {
  console.log('arguments: ', el, html, duration);
  if (!el) return;
  const originHTML = html ? html.replace(/\r|\n/g, '') : el.innerHTML.replace(/\r|\n/g, '');
  console.log('originHTML: ', originHTML);
  if (!originHTML) return;
  let curIndex = 0;
  el.innerHTML = null;
  const timer = setInterval(() => {
    if (curIndex > originHTML.length) {
      clearInterval(timer);
      callback();
      return;
    }
    el.innerHTML = originHTML.slice(0, curIndex);
    const leftHTML = originHTML.slice(curIndex);
    if (/^<\/?[^>]*>/.test(leftHTML)) {
      const tagLength = leftHTML.match(/^<\/?[^>]*>/)[0].length;
      curIndex += tagLength;
    } else {
      curIndex++;
    }
  }, duration);
}

export default Typer;
