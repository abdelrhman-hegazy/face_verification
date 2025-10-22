import { CONFIG } from "./config/env.js";
import app from "./app.js";
import { loadModels } from "./config/modelLoder.js";

(async () => {
  await loadModels();
  app.listen(CONFIG.PORT, () =>
    console.log(`Server running on port ${CONFIG.PORT}`)
  );
})();
