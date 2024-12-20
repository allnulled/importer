const Importer = class {

  static async scriptSrc(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve();
      script.onerror = (e) => reject(e);
      document.head.appendChild(script);
    });
  }

  static async scriptSrcModule(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.type = "module";
      script.onload = () => resolve();
      script.onerror = (e) => reject(e);
      document.head.appendChild(script);
    });
  }

  static async scriptAsync(url, context = {}) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch script: ${url}`);
    const scriptText = await response.text();
    const asyncFunction = new AsyncFunction(...Object.keys(context), scriptText);
    return asyncFunction(...Object.values(context));
  }

  static async linkStylesheet(href) {
    return new Promise((resolve, reject) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.onload = () => resolve();
      link.onerror = (e) => reject(e);
      document.head.appendChild(link);
    });
  }

  static async text(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch text: ${url}`);
    return response.text();
  }
  
}

window.Importer = Importer;