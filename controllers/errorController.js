async function throwError(req, res, next) {
    throw new Error("Intentional error 500: middleware test")
}

module.exports = {throwError}