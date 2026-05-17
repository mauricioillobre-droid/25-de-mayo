import {
  IconHeartRateMonitor,
  IconStethoscope,
  IconScissors,
  IconBodyScan,
  IconDroplet,
  IconDna,
  IconBabyCarriage,
  IconWaveSine,
  IconActivityHeartbeat,
  IconVenus,
  IconHandStop,
  IconLungs,
  IconBrain,
  IconVirus,
  IconBone,
  IconApple,
  IconEar,
  IconBook2,
  IconMan,
  IconMoodSmile,
  IconMoodNervous,
  IconRun,
  IconDroplets,
  IconPill,
  IconMicroscope,
  IconCirclePlus,
} from '@tabler/icons-react'

interface Props {
  type: string
  className?: string
  size?: number
}

export default function MedicalIcon({ type, className, size = 24 }: Props) {
  const props = { size, className, stroke: 1.75 }

  switch (type) {
    case 'heart':        return <IconHeartRateMonitor {...props} />
    case 'stethoscope':  return <IconStethoscope {...props} />
    case 'scissors':     return <IconScissors {...props} />
    case 'skin':         return <IconBodyScan {...props} />
    case 'drop':         return <IconDroplet {...props} />
    case 'flask':        return <IconDna {...props} />
    case 'baby':         return <IconBabyCarriage {...props} />
    case 'wave':         return <IconWaveSine {...props} />
    case 'vein':         return <IconActivityHeartbeat {...props} />
    case 'female':       return <IconVenus {...props} />
    case 'hands':        return <IconHandStop {...props} />
    case 'lung':         return <IconLungs {...props} />
    case 'brain':        return <IconBrain {...props} />
    case 'virus':        return <IconVirus {...props} />
    case 'bone':         return <IconBone {...props} />
    case 'apple':        return <IconApple {...props} />
    case 'ear':          return <IconEar {...props} />
    case 'book':         return <IconBook2 {...props} />
    case 'child':        return <IconMan {...props} />
    case 'mind':         return <IconMoodSmile {...props} />
    case 'head':         return <IconMoodNervous {...props} />
    case 'exercise':     return <IconRun {...props} />
    case 'kidney':       return <IconDroplets {...props} />
    case 'stomach':      return <IconPill {...props} />
    case 'colon':        return <IconMicroscope {...props} />
    default:             return <IconCirclePlus {...props} />
  }
}
