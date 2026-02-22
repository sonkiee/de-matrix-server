import { Request, Response, Router } from "express";
import { methodNotAllowedHandler } from "../middleware/error.middleware";
import api from "./api.routes";

const router = Router();

// Home route ("/")
router
  .route("/")
  .get((req: Request, res: Response) =>
    res.status(200).json({
      ok: true,
    }),
  )
  .all(methodNotAllowedHandler);

router
  .route("/api")
  .get((req: Request, res: Response) => res.redirect("/doc"))
  .all(methodNotAllowedHandler);

router.use("/api", api);

router.get("/favicon.ico", (_req, res) => res.status(204).end());

export default router;
