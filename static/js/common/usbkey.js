var base64encode = (function () {
    var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    return function (str) {
        var out = "",
            i = 0,
            len = str.length,
            c1,
            c2,
            c3;

        while (i < len) {
            c1 = str.charCodeAt(i++) & 0xff;
            if (i == len) {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt((c1 & 0x3) << 4);
                out += "==";
                break;
            }

            c2 = str.charCodeAt(i++);
            if (i == len) {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                out += base64EncodeChars.charAt((c2 & 0xF) << 2);
                out += "=";
                break;
            }

            c3 = str.charCodeAt(i++);
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
            out += base64EncodeChars.charAt(c3 & 0x3F);
        }
        return out;
    };
}());

var base64decode = (function () {
    var base64DecodeChars = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                             -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                             -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
                             52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
                             -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
                             15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
                             -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
                             41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1];

    return function (str) {
        var c1,
            c2,
            c3,
            c4,
            i = 0,
            len = str.length,
            out = "";

        while (i < len) {
            do {
                c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
            } while (i < len && c1 == -1);
            if (c1 == -1)
                break;

            do {
                c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
            } while (i < len && c2 == -1);
            if (c2 == -1)
                break;

            out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

            do {
                c3 = str.charCodeAt(i++) & 0xff;
                if (c3 == 61)
                    return out;
                c3 = base64DecodeChars[c3];
            } while (i < len && c3 == -1);
            if (c3 == -1)
                break;

            out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

            do {
                c4 = str.charCodeAt(i++) & 0xff;
                if (c4 == 61)
                    return out;
                c4 = base64DecodeChars[c4];
            } while (i < len && c4 == -1);
            if (c4 == -1)
                break;

            out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
        }
        return out;
    };
}());

var U_USBKey = (function () {
    var slice = [].slice,
        b64enc = base64encode,
        b64dec = base64decode,
        plugin,
        get_u_cert,
        close,
        set_u_id,
        get_s_pk,
        set_s_pk,
        get_u_id,
        get_u_type,
        get_u_arg,
        random,
        transform,
        signature,
        symencrypt,
        symdecrypt,
        verify,
        browser = (function () {
            var userAgent = navigator.userAgent.toLowerCase(); 
            return { 
                version: (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [0, '0'])[1], 
                safari: /webkit/.test( userAgent ), 
                opera: /opera/.test( userAgent ), 
                msie: /msie/.test( userAgent ) && !/opera/.test( userAgent ), 
                mozilla: /mozilla/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent ) 
            };    
        }()),
        Constr;

    get_u_cert = function () {
        var cert = null;

        try {
            cert = plugin.get_u_cert(this.uk);
        } catch (e) {
            throw {
                name: 'DeviceError',
                message: 'get_u_cert',
                raw: e
            };
        }
        if (!cert) {
            throw {
                name: 'LogicError',
                message: 'Get User Certificate: cert=' + cert
            };
        }
        return cert;
    };

    close = function () {
        try {
            plugin.close(this.uk);
        } catch (e) {
            throw {
                name: 'DeviceError',
                message: 'close',
                raw: e
            };
        }

        return;
    };

    set_u_id = function (u_id) {
        var ret = 0;

        try {
            ret = plugin.set_u_id(this.uk, u_id);
        } catch (e) {
            throw {
                name: 'DeviceError',
                message: 'set_u_id',
                raw: e
            };
        }
        if (browser.msie && ret != 0) {
            throw {
                name: 'LogicError',
                message: 'Get User ID: errno =' + u_id
            };
        }
        return;
    };

    get_s_pk = function () {
        var s_pk = null;

        try {
            s_pk = plugin.get_s_pk(this.uk);
        } catch (e) {
            throw {
                name: 'DeviceError',
                message: 'get_s_pk',
                raw: e
            };
        }
        if (!s_pk) {
            throw {
                name: 'LogicError',
                message: 'Get Server Plublic Key: s_pk=' + s_pk
            };
        }
        return s_pk;
    };

    set_s_pk = function (s_pk) {
        var ret = 0;

        try {
            ret = plugin.set_s_pk(this.uk, s_pk);
        } catch (e) {
            throw {
                name: 'DeviceError',
                message: 'set_s_pk',
                raw: e
            };
        }
        if (browser.msie && ret !== 0) {
            throw {
                name: 'LogicError',
                message: 'Get User ID: errno =' + u_id
            };
        }
        return;
    };

    get_u_id = function () {
        var u_id = null;

        try {
            u_id = plugin.get_u_id(this.uk);
        } catch (e) {
            throw {
                name: 'DeviceError',
                message: 'get_u_id',
                raw: e
            };
        }
        if (u_id < 0) {
            throw {
                name: 'LogicError',
                message: 'Get User ID: errno =' + u_id
            };
        }
        return u_id;
    };

    get_u_type = function () {
        var u_type = null;

        try {
            u_type = plugin.get_u_type(this.uk);
        } catch (e) {
            throw {
                name: 'DeviceError',
                message: 'get_u_type',
                raw: e
            };
        }
        if (u_type < 0) {
            throw {
                name: 'LogicError',
                message: 'Get User Type: errno =' + u_type
            };
        }
        return u_type;
    };

    get_u_arg = function () {
        var u_arg = null;

        try {
            u_arg = plugin.get_u_arg(this.uk);
        } catch (e) {
            throw {
                name: 'DeviceError',
                message: 'get_u_arg',
                raw: e
            };
        }
        if (!u_arg) {
            throw {
                name: 'LogicError',
                message: 'Get User Argument: u_arg=' + u_arg
            };
        }
        return u_arg;
    };

    random = function () {
        var r = null;

        try {
            r = plugin.random(this.uk);
        } catch (e) {
            throw {
                name: 'DeviceError',
                message: 'random',
                raw: e
            };
        }
        if (!r) {
            throw {
                name: 'LogicError',
                message: 'Generate Random Number: r=' + r
            };
        }
        return r;
    };

    transform = function (g, x, p) {
        var cooked;

        try {
            cooked = plugin.transform(this.uk, g, x, p);
        } catch (e) {
            //alert(e);
            throw {
                name: 'DeviceError',
                message: 'transform',
                raw: e
            };
        }
        if (!cooked) {
            throw {
                name: 'LogicError',
                    message: 'Transform: cooked=' + cooked
            };
        }
        return cooked;
    };

    signature = function (msg) {
        var sig = null;

        try {
            sig = plugin.signature(this.uk, msg);
        } catch (e) {
            throw {
                name: 'DeviceError',
                message: 'signature',
                raw: e
            };
        }
        if (!sig) {
            throw {
                name: 'LogicError',
                message: 'Signature: sig=' + sig
            };
        }
        return sig;
    };

    symencrypt = function (sk, msg) {
        var cipher = null;

        try {
            cipher = plugin.symencrypt(this.uk, sk, msg);
        } catch (e) {
            throw {
                name: 'DeviceError',
                message: 'symencrypt',
                raw: e
            };
        }
        if (!cipher) {
            throw {
                name: 'LogicError',
                message: 'Symencrypt: cipher=' + cipher
            };
        }
        return cipher;
    };

    symdecrypt = function (sk, msg) {
        var plain = null;

        try {
            plain = plugin.symdecrypt(this.uk, sk, msg);
        } catch (e) {
            throw {
                name: 'DeviceError',
                message: 'symdecrypt',
                raw: e
            };
        }
        if (!plain) {
            throw {
                name: 'LogicError',
                message: 'Symdecrypt: plain=' + plain
            };
        }
        return plain;
    };

    verify = function (pk, sig, msg) {
        var valid;

        try {
            valid = plugin.verify(this.uk, pk, sig, msg);
        } catch (e) {
            throw {
                name: 'DeviceError',
                message: 'verify',
                raw: e
            };
        }
        if (browser.msie) {
            return (valid == 0);
        }
        return valid;
    };

    Constr = function (pin) {
        var callee = arguments.callee;

        if (!(this instanceof callee)) {
            return new callee(pin);
        }

        this.uk = 0;
        try {
            this.uk = plugin.open(pin, 1, 0);
        } catch (e) {
            throw {
                name: 'DeviceError',
                message: "open",
                raw: e
            };
        }
        if (!this.uk) {
            throw {
                name: 'LogicError',
                message: "Device Open Error -- uk: " + this.uk
            };
        }
        return this;
    };
    Constr.prototype = {
        name: "U_USBKey",
        version: "0.0.1",
        author: "gongxidong",
        company: "kylin",
        email: "gongxidong@kylinos.com.cn",
        get_u_cert: get_u_cert,
        close: close,
        set_u_id: set_u_id,
        get_s_pk: get_s_pk,
        set_s_pk: set_s_pk,
        get_u_id: get_u_id,
        get_u_type: get_u_type,
        get_u_arg: get_u_arg,
        random: random,
        transform: transform,
        signature: signature,
        symencrypt: symencrypt,
        symdecrypt: symdecrypt,
        verify: verify
    };
    Constr.b64enc = b64enc;
    Constr.b64dec = b64dec;

    if (browser.msie) {
        if (typeof KtsActivex !== 'undefined') {
            plugin = KtsActivex;    
        }
    }
    else if (browser.mozilla) {
        plugin = document.getElementById('usbkey4zb');    
    }
    if (!plugin) {
        throw {
            name: "DeviceError",
            message: 'Uninstalled or Unbooted Plugin'
        };
    }

    return Constr;
}());

// Usage:
// uk = new U_USBKey(pin);
// OR:
// uk = U_USBKey(pin);
// u_id = uk.get_u_id();
