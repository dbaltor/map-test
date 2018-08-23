/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.MapMessage = (function() {

    /**
     * Properties of a MapMessage.
     * @exports IMapMessage
     * @interface IMapMessage
     * @property {number|Long} type MapMessage type
     * @property {string} latitude MapMessage latitude
     * @property {string} longitude MapMessage longitude
     * @property {number|Long|null} [color] MapMessage color
     * @property {string|null} [vehicle] MapMessage vehicle
     */

    /**
     * Constructs a new MapMessage.
     * @exports MapMessage
     * @classdesc Represents a MapMessage.
     * @implements IMapMessage
     * @constructor
     * @param {IMapMessage=} [properties] Properties to set
     */
    function MapMessage(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * MapMessage type.
     * @member {number|Long} type
     * @memberof MapMessage
     * @instance
     */
    MapMessage.prototype.type = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * MapMessage latitude.
     * @member {string} latitude
     * @memberof MapMessage
     * @instance
     */
    MapMessage.prototype.latitude = "";

    /**
     * MapMessage longitude.
     * @member {string} longitude
     * @memberof MapMessage
     * @instance
     */
    MapMessage.prototype.longitude = "";

    /**
     * MapMessage color.
     * @member {number|Long} color
     * @memberof MapMessage
     * @instance
     */
    MapMessage.prototype.color = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * MapMessage vehicle.
     * @member {string} vehicle
     * @memberof MapMessage
     * @instance
     */
    MapMessage.prototype.vehicle = "";

    /**
     * Creates a new MapMessage instance using the specified properties.
     * @function create
     * @memberof MapMessage
     * @static
     * @param {IMapMessage=} [properties] Properties to set
     * @returns {MapMessage} MapMessage instance
     */
    MapMessage.create = function create(properties) {
        return new MapMessage(properties);
    };

    /**
     * Encodes the specified MapMessage message. Does not implicitly {@link MapMessage.verify|verify} messages.
     * @function encode
     * @memberof MapMessage
     * @static
     * @param {IMapMessage} message MapMessage message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    MapMessage.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int64(message.type);
        writer.uint32(/* id 2, wireType 2 =*/18).string(message.latitude);
        writer.uint32(/* id 3, wireType 2 =*/26).string(message.longitude);
        if (message.color != null && message.hasOwnProperty("color"))
            writer.uint32(/* id 4, wireType 0 =*/32).int64(message.color);
        if (message.vehicle != null && message.hasOwnProperty("vehicle"))
            writer.uint32(/* id 5, wireType 2 =*/42).string(message.vehicle);
        return writer;
    };

    /**
     * Encodes the specified MapMessage message, length delimited. Does not implicitly {@link MapMessage.verify|verify} messages.
     * @function encodeDelimited
     * @memberof MapMessage
     * @static
     * @param {IMapMessage} message MapMessage message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    MapMessage.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a MapMessage message from the specified reader or buffer.
     * @function decode
     * @memberof MapMessage
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {MapMessage} MapMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    MapMessage.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.MapMessage();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.type = reader.int64();
                break;
            case 2:
                message.latitude = reader.string();
                break;
            case 3:
                message.longitude = reader.string();
                break;
            case 4:
                message.color = reader.int64();
                break;
            case 5:
                message.vehicle = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("type"))
            throw $util.ProtocolError("missing required 'type'", { instance: message });
        if (!message.hasOwnProperty("latitude"))
            throw $util.ProtocolError("missing required 'latitude'", { instance: message });
        if (!message.hasOwnProperty("longitude"))
            throw $util.ProtocolError("missing required 'longitude'", { instance: message });
        return message;
    };

    /**
     * Decodes a MapMessage message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof MapMessage
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {MapMessage} MapMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    MapMessage.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a MapMessage message.
     * @function verify
     * @memberof MapMessage
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    MapMessage.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.type) && !(message.type && $util.isInteger(message.type.low) && $util.isInteger(message.type.high)))
            return "type: integer|Long expected";
        if (!$util.isString(message.latitude))
            return "latitude: string expected";
        if (!$util.isString(message.longitude))
            return "longitude: string expected";
        if (message.color != null && message.hasOwnProperty("color"))
            if (!$util.isInteger(message.color) && !(message.color && $util.isInteger(message.color.low) && $util.isInteger(message.color.high)))
                return "color: integer|Long expected";
        if (message.vehicle != null && message.hasOwnProperty("vehicle"))
            if (!$util.isString(message.vehicle))
                return "vehicle: string expected";
        return null;
    };

    /**
     * Creates a MapMessage message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof MapMessage
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {MapMessage} MapMessage
     */
    MapMessage.fromObject = function fromObject(object) {
        if (object instanceof $root.MapMessage)
            return object;
        var message = new $root.MapMessage();
        if (object.type != null)
            if ($util.Long)
                (message.type = $util.Long.fromValue(object.type)).unsigned = false;
            else if (typeof object.type === "string")
                message.type = parseInt(object.type, 10);
            else if (typeof object.type === "number")
                message.type = object.type;
            else if (typeof object.type === "object")
                message.type = new $util.LongBits(object.type.low >>> 0, object.type.high >>> 0).toNumber();
        if (object.latitude != null)
            message.latitude = String(object.latitude);
        if (object.longitude != null)
            message.longitude = String(object.longitude);
        if (object.color != null)
            if ($util.Long)
                (message.color = $util.Long.fromValue(object.color)).unsigned = false;
            else if (typeof object.color === "string")
                message.color = parseInt(object.color, 10);
            else if (typeof object.color === "number")
                message.color = object.color;
            else if (typeof object.color === "object")
                message.color = new $util.LongBits(object.color.low >>> 0, object.color.high >>> 0).toNumber();
        if (object.vehicle != null)
            message.vehicle = String(object.vehicle);
        return message;
    };

    /**
     * Creates a plain object from a MapMessage message. Also converts values to other types if specified.
     * @function toObject
     * @memberof MapMessage
     * @static
     * @param {MapMessage} message MapMessage
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    MapMessage.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            if ($util.Long) {
                var long = new $util.Long(0, 0, false);
                object.type = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.type = options.longs === String ? "0" : 0;
            object.latitude = "";
            object.longitude = "";
            if ($util.Long) {
                var long = new $util.Long(0, 0, false);
                object.color = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.color = options.longs === String ? "0" : 0;
            object.vehicle = "";
        }
        if (message.type != null && message.hasOwnProperty("type"))
            if (typeof message.type === "number")
                object.type = options.longs === String ? String(message.type) : message.type;
            else
                object.type = options.longs === String ? $util.Long.prototype.toString.call(message.type) : options.longs === Number ? new $util.LongBits(message.type.low >>> 0, message.type.high >>> 0).toNumber() : message.type;
        if (message.latitude != null && message.hasOwnProperty("latitude"))
            object.latitude = message.latitude;
        if (message.longitude != null && message.hasOwnProperty("longitude"))
            object.longitude = message.longitude;
        if (message.color != null && message.hasOwnProperty("color"))
            if (typeof message.color === "number")
                object.color = options.longs === String ? String(message.color) : message.color;
            else
                object.color = options.longs === String ? $util.Long.prototype.toString.call(message.color) : options.longs === Number ? new $util.LongBits(message.color.low >>> 0, message.color.high >>> 0).toNumber() : message.color;
        if (message.vehicle != null && message.hasOwnProperty("vehicle"))
            object.vehicle = message.vehicle;
        return object;
    };

    /**
     * Converts this MapMessage to JSON.
     * @function toJSON
     * @memberof MapMessage
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    MapMessage.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return MapMessage;
})();

module.exports = $root;
