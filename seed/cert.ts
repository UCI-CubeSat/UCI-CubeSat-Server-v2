import { samlConfig } from '@/config/auth.js'
import { env } from '@/services/env.js'
import { Strategy as SamlStrategy } from '@node-saml/passport-saml'
const strat = new SamlStrategy(
    samlConfig,
    (req, profile, done) => {
        if (profile) {
            done(null, profile)
        }
    },
    (req, profile, done) => {
        if (profile) {
            done(null, profile)
        }
    }
)

console.log(strat.generateServiceProviderMetadata(env.SAML_DECRYPT_PUBLIC_CERT, null))