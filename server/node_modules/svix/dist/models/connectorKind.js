"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectorKindSerializer = exports.ConnectorKind = void 0;
var ConnectorKind;
(function (ConnectorKind) {
    ConnectorKind["Custom"] = "Custom";
    ConnectorKind["CustomerIo"] = "CustomerIO";
    ConnectorKind["Discord"] = "Discord";
    ConnectorKind["Hubspot"] = "Hubspot";
    ConnectorKind["Inngest"] = "Inngest";
    ConnectorKind["Salesforce"] = "Salesforce";
    ConnectorKind["Segment"] = "Segment";
    ConnectorKind["Slack"] = "Slack";
    ConnectorKind["Teams"] = "Teams";
    ConnectorKind["TriggerDev"] = "TriggerDev";
    ConnectorKind["Windmill"] = "Windmill";
    ConnectorKind["Zapier"] = "Zapier";
})(ConnectorKind = exports.ConnectorKind || (exports.ConnectorKind = {}));
exports.ConnectorKindSerializer = {
    _fromJsonObject(object) {
        return object;
    },
    _toJsonObject(self) {
        return self;
    },
};
//# sourceMappingURL=connectorKind.js.map