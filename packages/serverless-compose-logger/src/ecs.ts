export type ExtendedElasticCommonSchema =
  | BaseFields
  | {
      agent?: AgentFields
      client?: ClientFields
      cloud?: CloudFields
      container?: ContainerFields
      destination?: DestinationFields
      ecs?: ECSFields
      error?: ErrorFields
      event?: EventFields
      file?: FileFields
      host?: HostFields
      http?: HTTPFields
      log?: LogFields
      network?: NetworkFields
      observer?: ObserverFields
      organization?: OrganizationFields
      os?: OSFields
      process?: ProcessFields
      related?: RelatedFields
      server?: ServerFields
      service?: ServiceFields
      source?: SourceFields
      url?: URLFields
      user?: UserFields
      user_agent?: UserAgentFields
    }
  | ExtendedAPMFields
  | ExtendedLambdaFields

interface ExtendedAPMFields {
  processor?: {
    name?: string
    event?: string
  }
  timestamp?: {
    us?: number
  }
  http?: {
    request?: {
      headers?: {
        [key: string]: string
      }
    }
    response?: {
      headers?: {
        [key: string]: string
      }
      finished?: boolean
    }
  }
  service?: {
    environment?: string
    language?: {
      name?: string
      version?: string
    }
    runtime?: {
      name?: string
      version?: string
    }
    framework?: {
      name?: string
      version?: string
    }
  }
  transaction?: {
    id?: string
    sampled?: boolean
    type?: string
  }
  trace?: {
    id?: string
  }
  parent?: {
    id?: string
  }
  kubernetes?: {
    namespace?: string
    node?: {
      name?: string
      pod?: string
      uid?: string
    }
  }
  observer?: {
    listening?: string
    version_major?: string
  }
}

interface ExtendedLambdaFields {
  correlation?: {
    id?: string
  }
  lambda?: {
    request?: {
      id?: string
    }
    arn?: string
  }
}

interface BaseFields {
  '@timestamp': Date
  labels?: {[key: string]: string}
  message?: string
  tags?: string[]
}

interface AgentFields {
  ephemeral_id?: string
  id?: string
  name: string
  type: string
  version: string
}

interface ClientFields {
  address?: string
  bytes?: number
  domain?: string
  ip?: string
  mac?: string
  packets?: number
  port?: number
  geo?: GeoFields
  user?: UserFields
}

interface CloudFields {
  account?: {
    id?: string
  }
  availability_zone?: string
  instance?: {
    id?: string
    name?: string
  }
  machine?: {
    type?: string
  }
  provider?: string
  region?: string
}

interface ContainerFields {
  id?: string
  image?: {
    name?: string
    tag?: string
  }
  labels?: {[key: string]: string}
  name?: string
  runtime?: string
}

interface DestinationFields {
  address?: string
  bytes?: number
  domain?: string
  ip?: string
  mac?: string
  packets?: number
  port?: number
  geo?: GeoFields
  user?: UserFields
}

interface ECSFields {
  version?: string
}

interface ErrorFields {
  code?: string
  id?: string
  message?: string
}

interface EventFields {
  action?: string
  category?: string
  created?: Date
  dataset?: string
  duration?: number
  end?: Date
  hash?: string
  id?: string
  kind?: string
  module?: string
  original?: string
  outcome?: string
  risk_score?: number
  risk_score_norm?: number
  severity?: number
  start?: Date
  timezone?: string
  type?: string
}

interface FileFields {
  ctime?: Date
  device?: string
  extension?: string
  gid?: string
  group?: string
  ionode?: string
  mode?: string
  mtime?: string
  owner?: string
  path?: string
  size?: number
  target_path?: string
  type?: string
  uid?: string
}

interface GeoFields {
  city_name?: string
  continent_name?: string
  country_iso_code?: string
  country_name?: string
  location?: {
    lat: number
    lon: number
  }
  name?: string
  region_iso_code?: string
  region_name?: string
}

interface GroupFields {
  id?: string
  name?: string
}

interface HostFields {
  architecture?: string
  hostname?: string
  id?: string
  ip?: string
  mac?: string
  name?: string
  type?: string
  geo?: GeoFields
  os?: OSFields
  user?: UserFields
}

interface HTTPFields {
  request?: {
    body?: {
      bytes?: number
      content?: string
    }
    bytes?: number
    method?: string
    referrer?: string
  }
  response?: {
    body?: {
      bytes?: number
      content?: string
    }
    bytes?: number
    status_code?: number
  }
  version?: string
}

interface LogFields {
  level?: string
  original?: string
}

interface NetworkFields {
  application?: string
  bytes?: number
  community_id?: string
  direction?: string
  forwarded_ip?: string
  iana_number?: string
  name?: string
  packets?: number
  protocol?: string
  transport?: string
  type?: string
}

interface ObserverFields {
  hostname?: string
  ip?: string
  mac?: string
  serial_number?: string
  type?: string
  vendor?: string
  versiom?: string
  geo?: GeoFields
  os?: OSFields
}

interface OrganizationFields {
  id?: string
  name?: string
}

interface OSFields {
  family?: string
  full?: string
  kernel?: string
  name?: string
  platform?: string
  version?: string
}

interface ProcessFields {
  args?: string
  executable?: string
  name?: string
  pid?: number
  ppid?: number
  start?: Date
  thread?: {
    id?: number
  }
  title?: string
  working_directory?: string
}

interface RelatedFields {
  ip?: string
}

interface ServerFields {
  address?: string
  bytes?: number
  domain?: string
  ip?: string
  mac?: string
  packets?: number
  port?: number
  geo?: GeoFields
  user?: UserFields
}

interface ServiceFields {
  ephemeral_id?: string
  id?: string
  name?: string
  state?: string
  type?: string
  version?: string
}

interface SourceFields {
  address?: string
  bytes?: number
  domain?: string
  ip?: string
  mac?: string
  packets?: number
  port?: number
  geo?: GeoFields
  user?: UserFields
}

interface URLFields {
  domain?: string
  fragment?: string
  full?: string
  original?: string
  password?: string
  path?: string
  port?: number
  query?: string
  scheme?: string
  username?: string
}

interface UserFields {
  email?: string
  full_name?: string
  hash?: string
  id?: string
  name?: string
  group?: GroupFields
}

interface UserAgentFields {
  device?: {
    name?: string
  }
  name?: string
  original?: string
  version?: string
  os?: OSFields
}
