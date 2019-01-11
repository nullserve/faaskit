workflow "Build and deploy on push" {
  on = "push"
  resolves = ["Test"]
}

action "Install dependencies" {
  uses = "docker://node"
  runs = "yarn"
  args = "install --frozen-lockfile"
}

action "Build" {
  needs = "Install dependencies"
  uses  = "docker://node"
  runs  = "yarn"
  args  = "build"
}

action "Test" {
  needs = "Build"
  uses  = "docker://node"
  runs  = "yarn"
  args  = "test --coverage"
}
