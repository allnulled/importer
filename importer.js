const Importer = class {

  static create(...args) {
    return new this(...args);
  }

  constructor(total_modules = 0, options_input = {}) {
    const options = Object.assign({}, {
      id: "#intersitial",
      id_loaded: "#intersitial_modules_loaded",
      id_all: "#intersitial_modules_all",
      id_trace: "#intersitial_modules_trace",
      id_loader: "#intersitial_loader",
      id_loader_bar: "#intersitial_loader_bar",
    }, options_input);
    this.id = options.id;
    this.id_all = options.id_all;
    this.id_loaded = options.id_loaded;
    this.id_trace = options.id_trace;
    this.id_loader = options.id_loader;
    this.id_loader_bar = options.id_loader_bar;
    this.modules_total = total_modules;
    this.modules_loaded = -1;
    this.time_of_creation = new Date();
    this.is_loaded = false;
    this.updateTotalModules();
  }

  getMillisecondsOfLife() {
    return this.formatMilliseconds(new Date() - this.time_of_creation);
  }

  formatMilliseconds(ms) {
    return ms.toLocaleString("es-ES");
  }

  updateTotalModules(total = undefined) {
    try {
      if(typeof total !== "undefined") {
        this.modules_total = total;
      }
      const htmlTotal = document.querySelector(this.id_all);
      htmlTotal.textContent = this.modules_total;
    } catch (error) {
      console.log("[WARN][Importer] Cannot update total modules. Insert «" + this.id_all + "» to skip this warning.");
    }
  }

  prependTrace(message) {
    try {
      const htmlTrace = document.querySelector(this.id_trace);
      if(htmlTrace.textContent.length) {
        htmlTrace.textContent = "\n" + htmlTrace.textContent;
      }
      htmlTrace.textContent = message + htmlTrace.textContent;
    } catch (error) {
      console.log("[WARN][Importer] Cannot append trace. Insert «" + this.id_trace + "» to skip this warning.");
    }
  }

  increaseLoadedModules(moduleType = "unknown", moduleId = "unknown") {
    try {
      console.log(`[OK][Importer] Loaded «${moduleId}» as «${moduleType}» ${this.getMillisecondsOfLife()}`);
      const htmlLoaded = document.querySelector(this.id_loaded);
      htmlLoaded.textContent = ++this.modules_loaded;
      this.prependTrace(`Loaded «${moduleType}» from «${moduleId}»`);
      this.updateLoaderBar();
      if((this.modules_loaded+1) >= this.modules_total) {
        this.removeIntersitial();
      }
    } catch (error) {
      if(this.is_loaded) {
        console.log("[CAUTION][Importer] Module out of the count was loaded: type «" + moduleType + "» from «" + moduleId + "».");
      } else {
        console.log("[WARN][Importer] Cannot update total modules. Insert «" + this.id_loaded + "» to skip this warning.");
      }
    }
  }

  updateLoaderBar() {
    try {
      const htmlLoaderBar = document.querySelector(this.id_loader_bar);
      const percentageCompleted = Math.round((this.modules_loaded / this.modules_total) * 100);
      htmlLoaderBar.style.width = percentageCompleted + "%";
    } catch (error) {
      console.log("[WARN][Importer] Cannot update loaded bar. Insert «" + this.id_loader_bar + "» inside of «" + this.id_loader + "» to skip this warning.");
    }
  }

  removeIntersitial() {
    try {
      this.is_loaded = true;
      const intersitial = document.querySelector(this.id);
      intersitial.remove();
    } catch (error) {
      console.log("[WARN][Importer] Cannot remove intersitial. Insert «" + this.id + "» to skip this warning.");
    }
  }

  async scriptSrc(src) {
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve();
      script.onerror = (e) => reject(e);
      document.head.appendChild(script);
    });
    this.increaseLoadedModules("script.src", src);
    return;
  }

  async scriptSrcModule(src) {
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.type = "module";
      script.onload = () => resolve();
      script.onerror = (e) => reject(e);
      document.head.appendChild(script);
    });
    this.increaseLoadedModules("script.src.module", src);
    return;
  }

  async scriptAsync(url, context = {}) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch script: ${url}`);
    const scriptText = await response.text();
    const AsyncFunction = (async function () { }).constructor;
    const asyncFunction = new AsyncFunction(...Object.keys(context), scriptText);
    const result = await asyncFunction(...Object.values(context));
    this.increaseLoadedModules("script.async", url);
    return result;
  }

  async linkStylesheet(href) {
    await new Promise((resolve, reject) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.type = "text/css";
      link.href = href;
      link.onload = () => resolve();
      link.onerror = (e) => reject(e);
      document.head.appendChild(link);
    });
    this.increaseLoadedModules("link.stylesheet.css", href);
    return;
  }

  async text(url) {
    const response = await fetch(url);
    this.increaseLoadedModules("text", url);
    if (!response.ok) throw new Error(`Failed to fetch text: ${url}`);
    return response.text();
  }

  async importVueComponent(url) {
    try {
      const urlJs = url + ".js";
      const urlCss = url + ".css";
      const urlHtml = url + ".html";
      const template = await this.text(urlHtml);
      await this.scriptAsync(urlJs, { $template: template });
      await this.linkStylesheet(urlCss);
      this.increaseLoadedModules("vue.component", url);
    return;
  } catch (error) {
      console.log(error);
      throw error;
    }
  }

}

window.Importer = Importer;
window.importer = new Importer();