#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import ast
import sys

file_path = '/Users/yanyu/yyc3-xiaoyu-ai/docs/言语记忆/沫语成长守护体系_统一成长记录系统.py'

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        code = f.read()
    
    tree = ast.parse(code)
    
    print('=== 语法分析结果 ===')
    print(f'✓ 文件语法正确，无语法错误')
    print(f'✓ 文件总行数: {len(code.splitlines())}')
    print(f'✓ AST解析成功')
    
    print('\n=== 代码结构分析 ===')
    classes = [node for node in ast.walk(tree) if isinstance(node, ast.ClassDef)]
    functions = [node for node in ast.walk(tree) if isinstance(node, ast.FunctionDef)]
    
    print(f'类定义数量: {len(classes)}')
    print(f'函数定义数量: {len(functions)}')
    
    print('\n=== 主要类列表 ===')
    for cls in classes:
        methods = [node.name for node in cls.body if isinstance(node, ast.FunctionDef)]
        print(f'  - {cls.name} ({len(methods)}个方法)')
    
    print('\n=== 导入模块统计 ===')
    imports = [node for node in ast.walk(tree) if isinstance(node, (ast.Import, ast.ImportFrom))]
    print(f'导入语句数量: {len(imports)}')
    
    print('\n=== 代码质量检查 ===')
    issues = []
    
    for node in ast.walk(tree):
        if isinstance(node, ast.FunctionDef):
            if not node.body:
                issues.append(f'空函数: {node.name} (行{node.lineno})')
    
    if issues:
        print('发现潜在问题:')
        for issue in issues:
            print(f'  ! {issue}')
    else:
        print('✓ 未发现明显的代码质量问题')
    
except SyntaxError as e:
    print(f'✗ 语法错误: {e}')
    print(f'  行号: {e.lineno}')
    print(f'  错误位置: {e.text}')
    sys.exit(1)
except Exception as e:
    print(f'✗ 分析错误: {e}')
    sys.exit(1)
