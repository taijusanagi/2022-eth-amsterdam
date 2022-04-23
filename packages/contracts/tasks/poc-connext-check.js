task("poc-connext-check", "check cross message update")
  .addParam("target", "target contract address")
  .setAction(async (taskArgs) => {
    const { target } = taskArgs;

    const PermissionedTarget = await ethers.getContractFactory(
      "PermissionedTarget"
    );
    const permissionedTarget = await PermissionedTarget.attach(target);

    const value = await permissionedTarget.value();
    console.log(value);
  });
