# OTGateway — experimental hardware branch

This repository is an **experimental fork of [Laxilef/OTGateway](https://github.com/Laxilef/OTGateway)**.

It is **not a new or independently developed OpenTherm gateway project**. The application, most of the source code, web interface, documentation concept, and core functionality originate from the upstream OTGateway project.

The purpose of this repository is to experiment with hardware-specific adaptations and stability improvements for three boards:

| Hardware | PlatformIO environment | Focus |
|---|---|---|
| **Lolin S2 Mini (ESP32-S2)** | s2_mini | Reduced task stack sizes, portal stability, runtime diagnostics |
| **ESP32-S3 N16R8** | s3_mini_n16r8 | S3/N16R8 adaptation and stability testing |
| **WT32-ETH01 (ESP32 + Ethernet)** | wt32_eth01 | Ethernet-based OTGateway hardware |

Additional PlatformIO environments are retained where useful for experiments and comparison, but the three boards above are the scope of this fork.

## Upstream project

**Original project:** [Laxilef/OTGateway](https://github.com/Laxilef/OTGateway)

**Upstream release baseline:** OTGateway 1.6.0

Please refer to the upstream project for the original feature set, supported boilers, configuration details, OpenTherm information, and general documentation:

- [OTGateway repository](https://github.com/Laxilef/OTGateway)
- [OTGateway Wiki](https://github.com/Laxilef/OTGateway/wiki)
- [Compatibility](https://github.com/Laxilef/OTGateway/wiki/Compatibility)

## Experimental changes

The current work in this repository includes, among other things:

- **Static portal navigation** generated at build time instead of runtime DOM-generated navigation. The runtime navigation script path was removed after stability problems were observed on the ESP32-S2.
- **Local ESP32Scheduler copy** with access to FreeRTOS task handles for diagnostics.
- **Board-specific task stack sizing** based on measured stack high-water marks rather than the original one-size-fits-all allocation.
- Diagnostic endpoints such as /api/debug and /api/tasks used during hardware and stability testing.
- PlatformIO configurations for the three target hardware families and additional experimental S3 variants.

These changes are experimental. They should not be considered part of the official upstream OTGateway project unless they are later accepted upstream.

## Current test status

The branch is being tested on real hardware rather than treated as a finished release.

For example, the ESP32-S3 N16R8 s3_mini_n16r8_noble test build recently produced two consecutive 200-packet ping runs with:

- **0% packet loss**
- average RTT **2.62 ms** and **2.65 ms**
- maximum RTT **11.42 ms** and **21.00 ms**

Other boards are tested separately with their corresponding hardware configurations.

## Building

This is a PlatformIO project. Select the appropriate environment from platformio.ini.

```text
pio run -e s2_mini
pio run -e s3_mini_n16r8
pio run -e wt32_eth01
```

Experimental S3 variants are also available in platformio.ini.

## Attribution

This repository is based on the work of **Laxilef and the OTGateway contributors**. Please see the upstream project and its documentation for the original project and contributor information.

The project also uses third-party libraries and components listed in the upstream OTGateway documentation and source tree.
