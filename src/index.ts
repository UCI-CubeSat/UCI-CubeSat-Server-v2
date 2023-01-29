import expressApp from './server.js'
import { env } from './services/env.js'

expressApp.listen(env.PORT, env.HOST_NAME, () => {
    console.log(`Example app listening on port ${env.PORT}`)
})
