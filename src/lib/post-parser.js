import yaml from 'yaml';

export default class PostParser {
  constructor(postData) {
    this.data = postData;
  }

  parse() {
    const [frontMatter,markdown] = this._splitFile();

    return {
      metadata: frontMatter ? yaml.parse(frontMatter) : null,
      text: markdown
    };
  }

  _splitFile() {
    const lines = this.data.split('\n');
    const frontMatterDelim = /^-{3,}/i;

    const mdBuffer = [];
    const yamlBuffer = [];

    let inFrontMatter = false;
    let startedMarkdown = false;
    let i = 0;
    while (i < lines.length) {
      const currentLine = lines[i];
      if (startedMarkdown) {
        mdBuffer.push(currentLine);
      } else if (currentLine.trim().length > 0) {
        if (inFrontMatter) {
          if (frontMatterDelim.test(currentLine)) {
            inFrontMatter = false;
            startedMarkdown = true;
          } else {
            yamlBuffer.push(currentLine);
          }
        } else {
          if (frontMatterDelim.test(currentLine)) {
            inFrontMatter = true;
          } else {
            startedMarkdown = true;
            mdBuffer.push(currentLine);
          }
        }
      }
      i++;
    }

    return [yamlBuffer.join('\n'),mdBuffer.join('\n').trimLeft()];
  }
}