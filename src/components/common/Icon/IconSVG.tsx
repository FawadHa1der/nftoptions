import OneInchIcon from 'components/common/Icon/1inchIcon'
import useThemeColor from 'hooks/ui/useThemeColor'
import useThemeValue from 'hooks/ui/useThemeValue'
import React from 'react'
import * as Feather from 'react-feather'
import { ResponsiveValue } from 'types'

import ArgentXIcon from './ArgentXIcon'
import DiscordIcon from './DiscordIcon'
import DotIcon from './DotIcon'
import EthereumIcon from './EthereumIcon'
import ExpandIcon from './ExpandIcon'
import FlagIcon from './FlagIcon'
import MenuIcon from './MenuIcon'
import MetaMaskIcon from './MetaMaskIcon'
import OptimismIcon from './OptimismIcon'
import RewardsIcon from './RewardsIcon'
import StackIcon from './StackIcon'
import SwapIcon from './SwapIcon'
import TriangleDownIcon from './TriangleDownIcon'
import TriangleUpIcon from './TriangleUpIcon'
import TwitterIcon from './TwitterIcon'
import UniswapIcon from './UniswapIcon'
import WalletConnectIcon from './WalletConnectIcon'
import WalletLinkIcon from './WalletLinkIcon'

export enum IconType {
  MoreHorizontal = 'MoreHorizontal',
  ArgentX = 'ArgentX',
  ArrowDown = 'ArrowDown',
  ArrowUp = 'ArrowUp',
  ArrowLeft = 'ArrowLeft',
  ArrowRight = 'ArrowRight',
  ArrowUpRight = 'ArrowUpRight',
  ExternalLink = 'ExternalLink',
  PlusCircle = 'PlusCircle',
  Plus = 'Plus',
  Info = 'Info',
  HelpCircle = 'HelpCircle',
  Twitter = 'Twitter',
  AlertTriangle = 'AlertTriangle',
  AlertCircle = 'AlertCircle',
  X = 'X',
  XSquare = 'XSquare',
  XCircle = 'XCircle',
  GitHub = 'GitHub',
  Copy = 'Copy',
  Circle = 'Circle',
  Flag = 'Flag',
  Activity = 'Activity',
  ChevronDown = 'ChevronDown',
  ChevronUp = 'ChevronUp',
  ChevronLeft = 'ChevronLeft',
  ChevronRight = 'ChevronRight',
  Discord = 'Discord',
  Check = 'Check',
  CheckCircle = 'CheckCircle',
  Monitor = 'Monitor',
  TrendingUp = 'TrendingUp',
  TrendingDown = 'TrendingDown',
  ToggleRight = 'ToggleRight',
  ToggleLeft = 'ToggleLeft',
  Optimism = 'Optimism',
  Moon = 'Moon',
  Sun = 'Sun',
  TriangleUp = 'TriangleUp',
  TriangleDown = 'TriangleDown',
  Settings = 'Settings',
  Eye = 'Eye',
  EyeOff = 'EyeOff',
  Dot = 'Dot',
  Uniswap = 'Uniswap',
  Kwenta = 'Kwenta',
  OneInch = 'OneInch',
  Slash = 'Slash',
  Book = 'Book',
  Swap = 'Swap',
  Lock = 'Lock',
  PieChart = 'PieChart',
  Clock = 'Clock',
  BarChart = 'BarChart',
  BarChart2 = 'BarChart2',
  Droplet = 'Droplet',
  Box = 'Box',
  Shield = 'Shield',
  Hexagon = 'Hexagon',
  Zap = 'Zap',
  Download = 'Download',
  Upload = 'Upload',
  Ethereum = 'Ethereum',
  Gift = 'Gift',
  CornerDownRight = 'CornerDownRight',
  Star = 'Star',
  Code = 'Code',
  PenTool = 'PenTool',
  Inbox = 'Inbox',
  DollarSign = 'DollarSign',
  MetaMask = 'MetaMask',
  WalletConnect = 'WalletConnect',
  WalletLink = 'WalletLink',
  Maximize2 = 'Maximize2',
  Minimize2 = 'Minimize2',
  Menu = 'Menu',
  Expand = 'Expand',
  Stack = 'Stack',
  Rewards = 'Rewards',
}

export type CustomIconProps = {
  color: string
  size: number | string
}

export type SVGIconProps = {
  icon: IconType
  color?: string
  size?: ResponsiveValue
  strokeWidth?: ResponsiveValue
}

const getLocalIcon = (icon: IconType) => {
  switch (icon) {
    case IconType.Discord:
      return DiscordIcon
    case IconType.Twitter:
      return TwitterIcon
    case IconType.Optimism:
      return OptimismIcon
    case IconType.TriangleUp:
      return TriangleUpIcon
    case IconType.TriangleDown:
      return TriangleDownIcon
    case IconType.Dot:
      return DotIcon
    case IconType.Uniswap:
      return UniswapIcon
    case IconType.OneInch:
      return OneInchIcon
    case IconType.Swap:
      return SwapIcon
    case IconType.Ethereum:
      return EthereumIcon
    case IconType.MetaMask:
      return MetaMaskIcon
    case IconType.WalletConnect:
      return WalletConnectIcon
    case IconType.WalletLink:
      return WalletLinkIcon
    case IconType.Expand:
      return ExpandIcon
    case IconType.Menu:
      return MenuIcon
    case IconType.Stack:
      return StackIcon
    case IconType.Flag:
      return FlagIcon
    case IconType.Rewards:
      return RewardsIcon
    case IconType.ArgentX:
      return ArgentXIcon

    default:
      return null
  }
}

const LocalIcon = ({ icon, ...props }: SVGIconProps): JSX.Element | null => {
  const Component = getLocalIcon(icon)
  if (Component == null) {
    return null
  }
  return <Component {...(props as any)} />
}

export default function IconSVG({ icon, size, strokeWidth = 2, color = 'currentColor' }: SVGIconProps) {
  const customIconProps: CustomIconProps = {
    color: useThemeColor(color),
    size: useThemeValue(size),
  }
  const featherIconProps = {
    color: useThemeColor(color),
    size: useThemeValue(size),
    strokeWidth: useThemeValue(strokeWidth),
  }
  let iconEl: JSX.Element | null = null
  if (getLocalIcon(icon) != null) {
    iconEl = <LocalIcon icon={icon} {...customIconProps} />
  } else if (iconEl == null) {
    const FeatherIcon: React.FunctionComponent | null = (Feather as any)[icon]
    if (FeatherIcon != null) {
      iconEl = <FeatherIcon {...(featherIconProps as any)} />
    }
  }
  return iconEl
}
