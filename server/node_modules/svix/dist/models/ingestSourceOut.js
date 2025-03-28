"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngestSourceOutSerializer = void 0;
const adobeSignConfigOut_1 = require("./adobeSignConfigOut");
const cronConfig_1 = require("./cronConfig");
const docusignConfigOut_1 = require("./docusignConfigOut");
const githubConfigOut_1 = require("./githubConfigOut");
const hubspotConfigOut_1 = require("./hubspotConfigOut");
const segmentConfigOut_1 = require("./segmentConfigOut");
const shopifyConfigOut_1 = require("./shopifyConfigOut");
const slackConfigOut_1 = require("./slackConfigOut");
const stripeConfigOut_1 = require("./stripeConfigOut");
const svixConfigOut_1 = require("./svixConfigOut");
const zoomConfigOut_1 = require("./zoomConfigOut");
exports.IngestSourceOutSerializer = {
    _fromJsonObject(object) {
        const type = object["type"];
        let config;
        switch (type) {
            case "generic-webhook":
                config = {};
                break;
            case "cron":
                config = cronConfig_1.CronConfigSerializer._fromJsonObject(object["config"]);
                break;
            case "adobe-sign":
                config = adobeSignConfigOut_1.AdobeSignConfigOutSerializer._fromJsonObject(object["config"]);
                break;
            case "beehiiv":
                config = svixConfigOut_1.SvixConfigOutSerializer._fromJsonObject(object["config"]);
                break;
            case "brex":
                config = svixConfigOut_1.SvixConfigOutSerializer._fromJsonObject(object["config"]);
                break;
            case "clerk":
                config = svixConfigOut_1.SvixConfigOutSerializer._fromJsonObject(object["config"]);
                break;
            case "docusign":
                config = docusignConfigOut_1.DocusignConfigOutSerializer._fromJsonObject(object["config"]);
                break;
            case "github":
                config = githubConfigOut_1.GithubConfigOutSerializer._fromJsonObject(object["config"]);
                break;
            case "guesty":
                config = svixConfigOut_1.SvixConfigOutSerializer._fromJsonObject(object["config"]);
                break;
            case "hubspot":
                config = hubspotConfigOut_1.HubspotConfigOutSerializer._fromJsonObject(object["config"]);
                break;
            case "incident-io":
                config = svixConfigOut_1.SvixConfigOutSerializer._fromJsonObject(object["config"]);
                break;
            case "lithic":
                config = svixConfigOut_1.SvixConfigOutSerializer._fromJsonObject(object["config"]);
                break;
            case "nash":
                config = svixConfigOut_1.SvixConfigOutSerializer._fromJsonObject(object["config"]);
                break;
            case "pleo":
                config = svixConfigOut_1.SvixConfigOutSerializer._fromJsonObject(object["config"]);
                break;
            case "replicate":
                config = svixConfigOut_1.SvixConfigOutSerializer._fromJsonObject(object["config"]);
                break;
            case "resend":
                config = svixConfigOut_1.SvixConfigOutSerializer._fromJsonObject(object["config"]);
                break;
            case "safebase":
                config = svixConfigOut_1.SvixConfigOutSerializer._fromJsonObject(object["config"]);
                break;
            case "sardine":
                config = svixConfigOut_1.SvixConfigOutSerializer._fromJsonObject(object["config"]);
                break;
            case "segment":
                config = segmentConfigOut_1.SegmentConfigOutSerializer._fromJsonObject(object["config"]);
                break;
            case "shopify":
                config = shopifyConfigOut_1.ShopifyConfigOutSerializer._fromJsonObject(object["config"]);
                break;
            case "slack":
                config = slackConfigOut_1.SlackConfigOutSerializer._fromJsonObject(object["config"]);
                break;
            case "stripe":
                config = stripeConfigOut_1.StripeConfigOutSerializer._fromJsonObject(object["config"]);
                break;
            case "stych":
                config = svixConfigOut_1.SvixConfigOutSerializer._fromJsonObject(object["config"]);
                break;
            case "svix":
                config = svixConfigOut_1.SvixConfigOutSerializer._fromJsonObject(object["config"]);
                break;
            case "zoom":
                config = zoomConfigOut_1.ZoomConfigOutSerializer._fromJsonObject(object["config"]);
                break;
        }
        return {
            type,
            config,
            createdAt: new Date(object["createdAt"]),
            id: object["id"],
            ingestUrl: object["ingestUrl"],
            name: object["name"],
            uid: object["uid"],
            updatedAt: new Date(object["updatedAt"]),
        };
    },
    _toJsonObject(self) {
        let config;
        switch (self.type) {
            case "generic-webhook":
                config = {};
                break;
            case "cron":
                config = cronConfig_1.CronConfigSerializer._toJsonObject(self.config);
                break;
            case "adobe-sign":
                config = adobeSignConfigOut_1.AdobeSignConfigOutSerializer._toJsonObject(self.config);
                break;
            case "beehiiv":
                config = svixConfigOut_1.SvixConfigOutSerializer._toJsonObject(self.config);
                break;
            case "brex":
                config = svixConfigOut_1.SvixConfigOutSerializer._toJsonObject(self.config);
                break;
            case "clerk":
                config = svixConfigOut_1.SvixConfigOutSerializer._toJsonObject(self.config);
                break;
            case "docusign":
                config = docusignConfigOut_1.DocusignConfigOutSerializer._toJsonObject(self.config);
                break;
            case "github":
                config = githubConfigOut_1.GithubConfigOutSerializer._toJsonObject(self.config);
                break;
            case "guesty":
                config = svixConfigOut_1.SvixConfigOutSerializer._toJsonObject(self.config);
                break;
            case "hubspot":
                config = hubspotConfigOut_1.HubspotConfigOutSerializer._toJsonObject(self.config);
                break;
            case "incident-io":
                config = svixConfigOut_1.SvixConfigOutSerializer._toJsonObject(self.config);
                break;
            case "lithic":
                config = svixConfigOut_1.SvixConfigOutSerializer._toJsonObject(self.config);
                break;
            case "nash":
                config = svixConfigOut_1.SvixConfigOutSerializer._toJsonObject(self.config);
                break;
            case "pleo":
                config = svixConfigOut_1.SvixConfigOutSerializer._toJsonObject(self.config);
                break;
            case "replicate":
                config = svixConfigOut_1.SvixConfigOutSerializer._toJsonObject(self.config);
                break;
            case "resend":
                config = svixConfigOut_1.SvixConfigOutSerializer._toJsonObject(self.config);
                break;
            case "safebase":
                config = svixConfigOut_1.SvixConfigOutSerializer._toJsonObject(self.config);
                break;
            case "sardine":
                config = svixConfigOut_1.SvixConfigOutSerializer._toJsonObject(self.config);
                break;
            case "segment":
                config = segmentConfigOut_1.SegmentConfigOutSerializer._toJsonObject(self.config);
                break;
            case "shopify":
                config = shopifyConfigOut_1.ShopifyConfigOutSerializer._toJsonObject(self.config);
                break;
            case "slack":
                config = slackConfigOut_1.SlackConfigOutSerializer._toJsonObject(self.config);
                break;
            case "stripe":
                config = stripeConfigOut_1.StripeConfigOutSerializer._toJsonObject(self.config);
                break;
            case "stych":
                config = svixConfigOut_1.SvixConfigOutSerializer._toJsonObject(self.config);
                break;
            case "svix":
                config = svixConfigOut_1.SvixConfigOutSerializer._toJsonObject(self.config);
                break;
            case "zoom":
                config = zoomConfigOut_1.ZoomConfigOutSerializer._toJsonObject(self.config);
                break;
        }
        return {
            type: self.type,
            config: config,
            createdAt: self.createdAt,
            id: self.id,
            ingestUrl: self.ingestUrl,
            name: self.name,
            uid: self.uid,
            updatedAt: self.updatedAt,
        };
    },
};
//# sourceMappingURL=ingestSourceOut.js.map