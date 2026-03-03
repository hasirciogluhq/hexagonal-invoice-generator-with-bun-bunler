curr_dir=$(dirname "$0")
cd "$curr_dir"
bun build --production --minify --target=bun --outdir ../dist ../index.ts