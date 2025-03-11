// 2.0.1
// Reapl allows you to format text within messages. Please note that there is no option to disable this feature
function useMarkUpText(text) {
  const applyFormatting = (text,formatType) => {
    text.toLocaleLowerCase();
    switch (formatType) {
      case 'MultilineCode':
        return text.replace(/\`\`\`(.*?)\`\`\`/gis, '<pre><code class="lang-js line-numbers">$1</code></pre>');
        break;
      case 'InlineCode':
        return text.replace(/`(.*?)`/gis, '<mark class="mark-a">$1</mark>');
        break;
      case 'Strikethrough':
        return text.replace(/\~\~(.*?)\~\~/gis, '<s>$1</s>');
        break;
      case 'Thick':
        return text.replace(/\*\*(.*?)\*\*/gis, '<b>$1</b>');
        break;
      case 'EncodeHTML':
        // Encode HTML tags (optional, if needed)
        return text.replace(/<(.*?)>/gis, '&#60;$1&#62;');
        break;
      case 'HyperLink':
        return text.replace(/\b((?:https?|ftp):\/\/[^\s\°]+)/g, '<a href="$1">$1</a> ');
        break;
      case 'SensorsWords':
        return text.replace(new RegExp([].join('|'), 'gi'), '****');
        break;
      case 'BulletToAsterisk':
        return text.replace(/\•/g, '*');
        break;
      case 'MiddleDot':
        return text.replace(/\°/g, '•');
        break;
      case 'Italicize':
        return text.replace(/_(.*?)_/gis, '<i>$1</i>');
        break;
      case 'NumberedList':
        let num = 0;
        // Replace each cockroach with a sequential number 
        return text.replace(/\* \w+/gis, (match) => {
          return `${num++}. ${match.slice(1)}`; 
        }); 
        break;
      default:
        return text; // If formatType is not recognized, return the original text
        break;
    }
  };

  // List of formats to be applied markdownFeatures
  [
    'MultilineCode', 'Strikethrough', 
    'Thick', 'HyperLink',
    'MiddleDot', 'InlineCode',
  ].forEach((format) => {
    // Apply each format in sequence
    text = applyFormatting(text, format);
  });

  // Apply highlighting block by block after DOM update
  // https://prismjs.com/
  setTimeout(() => {
    document.querySelectorAll('pre code').forEach((block, index) => {
      setTimeout(function () {
        Prism.highlightElement(block);
      }, index * 100); // Delay each block by 100ms
    });
  }, 0);

  return text; // Starting text sorting
}

