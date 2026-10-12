"""Prints the --settings that limit an agent's MCP servers to the ones in the given config and the
claude.ai Figma connector.

The connector cannot be named in an --mcp-config, and --strict-mcp-config would drop it, so the
agent starts without it and is held to these servers by allowedMcpServers instead. A server is let
through by its name and, for a remote one such as the session elfie compile hosts, by its URL,
since a remote server must match a URL once any URL is listed. The config's servers also turn off
the project's .mcp.json servers of the same names, so the server --mcp-config names is the only one.
"""
import json, sys

FIGMA = "https://mcp.figma.com/mcp"

with open(sys.argv[1]) as config:
    servers = json.load(config)["mcpServers"]
allowed = [{"serverName": name} for name in servers]
allowed += [{"serverUrl": server["url"]} for server in servers.values() if "url" in server]
allowed.append({"serverUrl": FIGMA})
print(json.dumps({"allowedMcpServers": allowed, "disabledMcpjsonServers": list(servers)}))
