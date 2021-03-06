import {
    Asset,
    Float64,
    Int64,
    Name,
    Struct,
    TimePointSec,
    UInt8,
    UInt32,
    UInt64,
} from '@greymass/eosio'

@Struct.type('powerupstateresource')
export class PowerUpStateResource extends Struct {
    @Struct.field('uint8') version!: UInt8
    @Struct.field('int64') weight!: Int64
    @Struct.field('int64') weight_ratio!: Int64
    @Struct.field('int64') assumed_stake_weight!: Int64
    @Struct.field('int64') initial_weight_ratio!: Int64
    @Struct.field('int64') target_weight_ratio!: Int64
    @Struct.field('time_point_sec') initial_timestamp!: TimePointSec
    @Struct.field('time_point_sec') target_timestamp!: TimePointSec
    @Struct.field('float64') exponent!: Float64
    @Struct.field('uint32') decay_secs!: UInt32
    @Struct.field('asset') min_price!: Asset
    @Struct.field('asset') max_price!: Asset
    @Struct.field('int64') utilization!: Int64
    @Struct.field('int64') adjusted_utilization!: Int64
    @Struct.field('time_point_sec') utilization_timestamp!: TimePointSec
}

@Struct.type('powerupstate')
export class PowerUpState extends Struct {
    @Struct.field('uint8') version!: UInt8
    @Struct.field(PowerUpStateResource) net!: PowerUpStateResource
    @Struct.field(PowerUpStateResource) cpu!: PowerUpStateResource
    @Struct.field('uint32') powerup_days!: UInt32
    @Struct.field('asset') min_powerup_fee!: Asset
}

@Struct.type('rexstate')
export class REXState extends Struct {
    @Struct.field('uint8') version!: UInt8
    @Struct.field('asset') total_lent!: Asset
    @Struct.field('asset') total_unlent!: Asset
    @Struct.field('asset') total_rent!: Asset
    @Struct.field('asset') total_lendable!: Asset
    @Struct.field('asset') total_rex!: Asset
    @Struct.field('asset') namebid_proceeds!: Asset
    @Struct.field('uint64') loan_num!: UInt64
}

@Struct.type('powerup')
export class Powerup extends Struct {
    @Struct.field('name') payer!: Name
    @Struct.field('name') receiver!: Name
    @Struct.field('uint32') days!: UInt32
    @Struct.field('uint64') net_frac!: UInt64
    @Struct.field('uint64') cpu_frac!: UInt64
    @Struct.field('asset') max_payment!: Asset
}
