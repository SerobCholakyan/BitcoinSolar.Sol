@@ -6,6 +6,9 @@ import "@openzeppelin/contracts/access/Ownable.sol";
abstract contract SecurityBridge is Ownable {
    mapping(address => bool) private authorizedNodes;

    event NodeAuthorized(address indexed node);
    event NodeRevoked(address indexed node);

    constructor() Ownable(msg.sender) {
        authorizedNodes[msg.sender] = true;
    }
@@ -16,10 +19,17 @@ abstract contract SecurityBridge is Ownable {
    }

    function addAuthorizedNode(address node) external onlyOwner {
        require(node != address(0), "SECURITY_ERR: ZERO_ADDRESS");
        authorizedNodes[node] = true;
        emit NodeAuthorized(node);
    }

    function removeAuthorizedNode(address node) external onlyOwner {
        authorizedNodes[node] = false;
        emit NodeRevoked(node);
    }

    function isAuthorizedNode(address node) external view returns (bool) {
        return authorizedNodes[node];
    }
}
