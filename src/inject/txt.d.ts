// Allow text modules so the TypeScript server doesn't complain
declare module "*.txt" {
    const value: string
    export = value
}