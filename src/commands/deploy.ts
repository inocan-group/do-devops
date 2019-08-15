import { getConfig, runHooks } from "../shared";

/**
 * **Deploy Handler**
 *
 * The _deploy_ command is used when you want to push your changes
 * to an environment where they will be used. This can mean different
 * things based on context and this handler will support the following
 * deployment scenarios:
 *
 * 1. Deploy to `npm` (aka, publish)
 * 2. Deploy to a serverless environment by leveraging the **Serverless** framework
 *
 * Over time we may add other targets for deployment.
 */
export async function handler(argv: string[], opts: any) {
  const { deploy, global } = await getConfig();
  console.log(argv, opts);

  await runHooks(deploy.preDeployHooks);
  const helper = (await import(`./deploy-helpers/${deploy.target}-deploy`))
    .default;
  await helper(deploy, global);
}
