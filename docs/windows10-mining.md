Conflux（0.5.1 alpha2）如何在 Windows 10下挖矿
===

* 前提条件：<br>  
1. 我们已经 [拥有Conflux钱包地址](https://github.com/aoems/conflux-developer-site/edit/master/docs/Get_Conflux_webWallet.md); <br> 
2. 并且获取了最新版本的挖矿程序压缩包。当前测试网挖矿程序的最新版本是 `0.5.1 alpha2` .文件名：[conflux_win10_x64_v0.5.1-alpha-2.zip](https://github.com/Conflux-Chain/conflux-rust/releases/download/v0.5.1-alpha-2/conflux_win10_x64_v0.5.1-alpha-2.zip)
<br> 

---

* 解压缩程序包


鼠标点击进入: C 盘 --> User --> <UserName>
新建文件夹，改名为: conflux
将下载包解压至目录: conflux

⚠️目录结构为<br>
conflux <br>
└── run <br>
     ├── tg_config <br>
     ├── clear_state.sh <br>
     ├── conflux.exe <br>
     ├── default.toml <br>
     ├── log.yaml   <br>
     └── throttling.toml  <br>


--------

修改配置文件（2必须1可选）

用鼠标点击: C 盘 --> User --> <UserName> --> conflux --> run
用文本编辑器打开 default.toml 文件, 找到以下 item 进行配置:

* 设置: start_mining
只是移除行首`#`

* 设置: mining_author粘贴钱包地址

说明: 1、移除行首的`#`, 将我们的钱包地址前缀`0x`去掉，钱包的40位字符，填入`“”`中，替换原来的40个`a`字符

* 配置: public_address
我们通过浏览器链接到https://ip138.com/ 将获取的`您的IP地址是`后的数字串,填充进去public_address后面“1.1.1.1”.
（默认端口为 32323，如果直接复制百度上的ip地址后面要加上“:32323”，最终样式是xx.xx.xx.xx:32323）

配置完成, 保存退出.

---

* 运行 conflux
打开开始菜单, 搜索 cmd, 双击打开:
cd conflux\run
复制代码conflux --config default.toml 2>stderr.txt
复制代码即可开始挖矿

* 停止Conflux，即stop mining
在运行 conflux 的 cmd 窗口按： ctrl +c , 或者直接关闭cmd窗口，或者打开任务管理器：详细信息--> 查找 conflux， 选择之后结束进程

