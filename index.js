// Universal Module Definition (UMD).
// Uses Node, AMD or browser globals to create a module.
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.CSVBuilder = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
    function escapeCell(data) {
        var output = "";

        if (typeof(data) === "number") {
            output = String(data).replace(/\./g, ",");
        } else {
            output = '="' + String(typeof(data) === "undefined" ? "" : data).replace(/\"/g, `""`) + '"';
        }

        return output;
    }

    const dataMap = new WeakMap();

    class CSVBuilder {
        constructor() {
            dataMap.set(this, "");
        }

        get data() {
            return dataMap.get(this);
        }

        append(...data) {
            let dataString = this.data;

            for (let item of data) {
                if (dataString.length !== 0 && dataString[dataString.length - 1] !== "\n") {
                    // Not first item of current line
                    dataString += ";";
                }

                dataString += escapeCell(item);
            }

            dataMap.set(this, dataString);
        }

        appendLine(data = []) {
            if (!Array.isArray(data)) {
                data = [data];
            }
            
            const dataString = this.data;
            
            if (dataString.length !== 0 && dataString[dataString.length - 1] !== "\n") {
                // Not on empty line
                this.newLine();
            }

            this.append(...data);
            this.newLine();
        }

        newLine() {
            dataMap.set(this, this.data + "\n");
        }

        toString() {
            return this.data;
        }
    }

    return CSVBuilder;
}));